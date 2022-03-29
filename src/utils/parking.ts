import type { Game } from "@/types/Game";
import type { Parking, ParkingStatus } from "@/types/Parking";
import { Post } from "@/types/Post";
import type { Predict } from "@/types/Predict";

const debug = process.env.NEXT_PUBLIC_DEBUG;

export const isDebug = (): boolean => {
  return debug ? true : false;
};

export const parkingStatus = (
  now: Date,
  game: Game,
  parking: Parking,
  posts: Post[]
): ParkingStatus => {
  const openDate = new Date(game.startAt.getTime());
  openDate.setHours(openDate.getHours() - parking.hourToOpen);

  const closeDate = new Date(game.finishAt.getTime());
  closeDate.setHours(closeDate.getHours() + parking.hourToClose);

  if (!game.availableParkings.includes(parking.id)) {
    // 未開放
    return { state: "disable", percent: 0, fillMinutes: 0 };
  } else if (now.getTime() < openDate.getTime()) {
    // 開場前
    return { state: "beforeOpen", percent: 0, fillMinutes: 0 };
  } else if (now.getTime() >= closeDate.getTime()) {
    // 閉場後
    return { state: "afterClosed", percent: 0, fillMinutes: 0 };
  } else {
    const gameStart = new Date(game.startAt.getTime());
    const post = selectPostForCalc(game, parking, posts);
    if (post) {
      const percent = postPercent(now, parking, gameStart, post);
      if (percent >= 100) {
        return { state: "filled", percent: 100, fillMinutes: 0 };
      } else {
        const fillMinutes = postFillMinutes(now, game, parking, post);
        return { state: "opened", percent: percent, fillMinutes: fillMinutes };
      }
    } else {
      const percent = predictPercent(now, gameStart, parking.predicts);
      if (percent >= 100) {
        return { state: "filled", percent: 100, fillMinutes: 0 };
      } else {
        const fillMinutes = predictsFillDate(now, game, parking.predicts);
        return { state: "opened", percent: percent, fillMinutes: fillMinutes };
      }
    }
  }
};

export const selectPostForCalc = (game: Game, parking: Parking, posts: Post[]): Post | null => {
  let post: Post | null = null;

  const debugMode = isDebug();

  const isValidRatio = (minutes: number, ratio: number): boolean => {
    // 開始前と駐車率0.1以下は除外
    const duration = minutes - parking.minutesToPark;
    if (duration < 0 || ratio <= 0.1) {
      if (duration && debugMode) {
        console.log(`[${parking.id}, ${minutes}, ${ratio}] -> 不採用：開始前`);
      }
      if (ratio <= 0.1 && debugMode) {
        console.log(`[${parking.id}, ${minutes}, ${ratio}] -> 不採用：10%以下`);
      }
      return false;
    }
    // 駐車場が持つ駐車開始時間と駐車率傾き2倍までを有効な投稿とみなす
    const maxRatio = parking.slopeToPark * duration * 2;
    const valid = ratio <= maxRatio;
    if (!valid && debugMode) {
      console.log(
        `[${parking.id}, ${minutes}, ${ratio}] -> 不採用：非採用ライン越え（${maxRatio}）`
      );
    }

    return valid;
  };

  let selectedRatio = 0;
  posts.forEach((p) => {
    // 無効投稿は無視
    if (!isValidRatio(p.parkingMinutes, p.parkingRatio)) {
      return;
    }
    // 選出駐車率以下は無視
    if (p.parkingRatio <= selectedRatio) {
      if (debugMode) {
        console.log(
          `[${parking.id}, ${p.parkingMinutes}, ${p.parkingRatio}] -> 不採用：採用済み駐車率以下`
        );
      }
      return;
    }

    // 選出上書き
    post = p;
    selectedRatio = p.parkingRatio;
    if (debugMode) {
      console.log(`[${parking.id}, ${p.parkingMinutes}, ${p.parkingRatio}] -> 採用（上書き）`);
    }
  });

  return post;
};

export const postPercent = (now: Date, parking: Parking, gameStart: Date, post: Post): number => {
  // 既に満車
  if (post.parkingRatio === 1.0) {
    return 100;
  }

  const debugMode = isDebug();

  // 現在時間が試合開始まで何分か（開始前でマイナス値にする）
  const minutesToStart = (gameStart.getTime() - now.getTime()) / 60000;
  if (debugMode) {
    console.log(
      `[${parking.id}, ${post.parkingMinutes}, ${post.parkingRatio}] -> 試合開始まで: ${
        Math.floor(minutesToStart * 100) / 100
      }分`
    );
  }

  // 試合開始時間の駐車率を上限値とする
  // 試合開始後にも延々と駐車率が増える（＆満車になる）ことは実際に起こらない
  const percentToStart = post.parkingRatio + Math.abs(post.parkingMinutes) * parking.slopeToPark;
  const percentMax = percentToStart < 1.0 ? percentToStart : 1.0;
  if (debugMode) {
    console.log(
      `[${parking.id}, ${post.parkingMinutes}, ${post.parkingRatio}] -> 試合開始時刻駐車率上限: ${
        Math.floor(percentMax * 100) / 100
      }`
    );
  }

  // 投稿内容を起点として、駐車率の傾きに経過時間差分を掛ける
  let current =
    post.parkingRatio + (Math.abs(post.parkingMinutes) - minutesToStart) * parking.slopeToPark;
  if (current > percentMax) {
    current = percentMax;
  }
  if (debugMode) {
    console.log(
      `[${parking.id}, ${post.parkingMinutes}, ${post.parkingRatio}] -> 最終結果: ${
        Math.floor(current * 100) / 100
      }`
    );
  }

  return Math.floor(current * 100);
};

export const postFillMinutes = (now: Date, game: Game, parking: Parking, post: Post): number => {
  // 既に満車なら不要
  if (post.parkingRatio === 1.0) {
    return 0;
  }

  // 投稿と駐車場の傾きから満車になる残り時間を出す
  let postFillMinutes = (1.0 - post.parkingRatio) / parking.slopeToPark;

  // 投稿の試合開始までの時間（マイナス値）と残り時間を足し合わせて、満車になる時間
  const fillMinutesToStart = post.parkingMinutes + postFillMinutes;

  // マイナスになれば、試合開始前に満車になるの残り分を返す
  if (fillMinutesToStart < 0) {
    // 現在時刻から試合開始まで何分かを求めて、投稿時間との差分を出す
    const nowMinutes = Math.abs(
      post.parkingMinutes + (game.startAt.getTime() - now.getTime()) / 60000
    );
    postFillMinutes -= nowMinutes;
    return postFillMinutes > 0 ? Math.ceil(postFillMinutes) : 0;
  }

  // 試合開始後は駐車率がほぼ増えないので満車予想はしない
  return 0;
};

export const predictPercent = (now: Date, gameStart: Date, predicts: Predict[]): number => {
  if (predicts.length === 0) {
    return 0;
  }

  const timeNow = now.getTime();

  // 予測は時系列の昇順で並んでいる前提
  // 最後尾を越えていたら最後尾がそのまま継続しているとして、最後尾を返す
  let predictAbove = predicts[predicts.length - 1];
  let dateAbove = new Date(gameStart.getTime());
  dateAbove.setMinutes(dateAbove.getMinutes() + predictAbove.minutes);
  if (timeNow >= dateAbove.getTime()) {
    return predictAbove.ratio * 100;
  }

  // 後尾2つ目から探すので必ず2点の補完になる
  for (let i = predicts.length - 2; i >= 0; i--) {
    let dateBelow = new Date(gameStart.getTime());
    dateBelow.setMinutes(dateBelow.getMinutes() + predicts[i].minutes);

    // 過ぎた地点が下位側
    const timeBelow = dateBelow.getTime();
    const ratioBelow = predicts[i].ratio;
    if (timeNow >= timeBelow) {
      // 過ぎてない地点が上位側
      const timeAbove = dateAbove.getTime();
      const ratioAbove = predictAbove.ratio;
      // 線形補完
      const weightBelow = (timeAbove - timeNow) / (timeAbove - timeBelow);
      const weightAbove = (timeNow - timeBelow) / (timeAbove - timeBelow);
      const ratio = ratioBelow * weightBelow + ratioAbove * weightAbove;
      return Math.floor(ratio * 100);
    }

    predictAbove = predicts[i];
    dateAbove = dateBelow;
  }

  // 予測時間前ということで0
  return 0;
};

export const predictsFillDate = (now: Date, game: Game, predicts: Predict[]): number => {
  const nowStartMinutes = (game.startAt.getTime() - now.getTime()) / 60000;

  for (let i = 0; i < predicts.length; i++) {
    if (predicts[i].ratio >= 1.0) {
      let fillMinutes = predicts[i].minutes;
      fillMinutes += nowStartMinutes;
      // 現在時間を加味して正の数なら、満車時刻より前なのでその分を返す
      // 切り上げ
      return fillMinutes > 0 ? Math.ceil(fillMinutes) : 0;
    }
  }

  return 0;
};
