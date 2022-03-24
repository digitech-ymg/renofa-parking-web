import type { Game } from "@/types/Game";
import type { Parking, ParkingStatus } from "@/types/Parking";
import { Post } from "@/types/Post";
import type { Predict } from "@/types/Predict";

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
      // TODO: 採用した投稿データで計算する
      return { state: "filled", percent: 100, fillMinutes: 0 };
    } else {
      // 現状の埋まり具合と予測
      const percent = predictPercent(now, gameStart, parking.predicts);
      if (percent >= 100) {
        return { state: "filled", percent: 100, fillMinutes: 0 };
      } else {
        const fillDate = predictsFillDate(game, parking.predicts);
        const fillMinutes = fillDate ? Math.ceil((fillDate?.getTime() - now.getTime()) / 60000) : 0;
        return { state: "opened", percent: percent, fillMinutes: fillMinutes };
      }
    }
  }
};

export const selectPostForCalc = (game: Game, parking: Parking, posts: Post[]): Post | null => {
  let post = null;

  const isValidRatio = (minutes: number, ratio: number): boolean => {
    // 開始前と駐車率0.1以下は除外
    const duration = minutes - parking.minutesToPark;
    if (duration < 0 || ratio <= 0.1) {
      return false;
    }
    // 駐車場が持つ駐車開始時間と駐車率傾き2倍までを有効な投稿とみなす
    return ratio <= parking.slopeToPark * duration * 2;
  };

  let selectedRatio = 0;
  posts.forEach((p) => {
    // 無効投稿は無視
    if (!isValidRatio(p.parkingMinutes, p.parkingRatio)) {
      return;
    }
    // 選出駐車率以下は無視
    if (p.parkingRatio <= selectedRatio) {
      return;
    }

    // 選出上書き
    post = p;
    selectedRatio = p.parkingRatio;
  });

  return post;
};

const predictPercent = (now: Date, gameStart: Date, predicts: Predict[]): number => {
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

export const predictsFillDate = (game: Game, predicts: Predict[]): Date | null => {
  for (let i = 0; i < predicts.length; i++) {
    if (predicts[i].ratio >= 1.0) {
      const date = new Date(game.startAt.getTime());
      date.setMinutes(date.getMinutes() + predicts[i].minutes);
      return date;
    }
  }

  return null;
};
