import type { Game } from "@/types/Game";
import type { Parking, ParkingStatus } from "@/types/Parking";
import { Post } from "@/types/Post";
import type { ParkingState } from "@/types/Parking";

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

  // 調整地があれば加味する
  let adjustMinutes = 0;
  if (game.parkingOpenAdjustments) {
    const adjust = game.parkingOpenAdjustments.find((adjust) => adjust.parkingId === parking.id);
    if (adjust) {
      adjustMinutes = adjust.minutes;
      openDate.setMinutes(openDate.getMinutes() + adjustMinutes);
    }
  }

  const closeDate = new Date(game.finishAt.getTime());
  closeDate.setHours(closeDate.getHours() + parking.hourToClose);

  if (!game.availableParkings.includes(parking.id)) {
    // 未開放
    return { state: "disable", percent: 0, fillMinutes: 0 };
  } else if (game.soldOutParkings.includes(parking.id)) {
    // 完売
    return { state: "soldOut", percent: 0, fillMinutes: 0 };
  } else if (now.getTime() < openDate.getTime()) {
    // 開場前
    return { state: "beforeOpen", percent: 0, fillMinutes: 0 };
  } else if (now.getTime() >= closeDate.getTime()) {
    // 閉場後
    return { state: "afterClosed", percent: 0, fillMinutes: 0 };
  } else {
    const gameStart = new Date(game.startAt.getTime());
    const post = selectPostForCalc(parking, posts);
    if (post) {
      const percent = postPercent(now, game, parking, post);
      if (percent >= 100) {
        return { state: "filled", percent: 100, fillMinutes: 0 };
      } else {
        const fillMinutes = postFillMinutes(now, game, parking, post);
        return { state: "opened", percent: percent, fillMinutes: fillMinutes };
      }
    } else {
      const percent = predictPercent(now, gameStart, parking.predictParkingStates, adjustMinutes);
      if (percent >= 100) {
        return { state: "filled", percent: 100, fillMinutes: 0 };
      } else {
        const fillMinutes = predictsFillMinutes(
          now,
          game,
          parking.predictParkingStates,
          adjustMinutes
        );
        return { state: "opened", percent: percent, fillMinutes: fillMinutes };
      }
    }
  }
};

export const selectPostForCalc = (parking: Parking, posts: Post[]): Post | null => {
  let post: Post | null = null;

  const debugMode = isDebug();

  const isValidRatio = (minutes: number, ratio: number): boolean => {
    // 採用ステートの一致する駐車率で判定
    const adoption = parking.adoptionParkingStates.find((adopt) => adopt.ratio === ratio);
    if (!adoption) {
      // 未指定は許容しない
      return false;
    }

    if (ratio <= 0.1) {
      if (debugMode) {
        console.log(`[${parking.id}, ${minutes}, ${ratio}] -> 不採用：10%以下`);
      }
      return false;
    }

    if (minutes < adoption.minutes) {
      if (debugMode) {
        console.log(
          `[${parking.id}, ${minutes}, ${ratio}] -> 不採用：許容時間前（許容時間:${adoption.minutes}）`
        );
      }
      return false;
    }

    return true;
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

export const postPercent = (now: Date, game: Game, parking: Parking, post: Post): number => {
  const gameStart = new Date(game.startAt.getTime());

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

  // 投稿parkingRatioと同じ事前予測stateと次state
  let start: ParkingState = { minutes: 0, ratio: 0 };
  let next: ParkingState = { minutes: 0, ratio: 0 };
  parking.predictParkingStates.forEach((state, idx, array) => {
    if (state.ratio === post.parkingRatio) {
      start = state;
      if (idx !== array.length - 1) {
        next = array[idx + 1];
      }
    }
  });
  // どちらかが無い場合は、投稿データのままとする
  if (!start || !next) {
    return Math.floor(post.parkingRatio * 100);
  }

  // 傾き（2つのstateの差分、分あたりの上量駐車率）
  const minuteDuration = Math.abs(next.minutes - start.minutes);
  // 傾きが0の場合は、時間経過の増加なし
  let slope = 0;
  if (minuteDuration > 0) {
    slope = (next.ratio - start.ratio) / minuteDuration;
  }

  // 経過時間（投稿地点から現在時刻までの分）
  let minutesPassed = Math.abs(post.parkingMinutes + minutesToStart);
  // 投稿直後は投稿そのもの
  if (minutesPassed === 0) {
    return Math.floor(post.parkingRatio * 100);
  }
  // 2つの間隔よりは大きくしない（延々と上昇することをせず、nextの駐車率を超えないようにする）
  if (minutesPassed > minuteDuration) {
    minutesPassed = minuteDuration;
  }

  // 投稿内容を起点として、駐車率の傾きに経過時間差分を掛ける
  let current = post.parkingRatio + minutesPassed * slope;
  if (debugMode) {
    console.log(
      `[${parking.id}, ${post.parkingMinutes}, ${post.parkingRatio}] -> 最終結果: ${
        Math.floor(current * 100) / 100
      } (${post.parkingRatio} + ${minutesPassed} * ${slope})`
    );
  }

  return Math.floor(current * 100);
};

export const postFillMinutes = (now: Date, game: Game, parking: Parking, post: Post): number => {
  // 既に満車なら不要
  if (post.parkingRatio === 1.0) {
    return 0;
  }

  // 開場調整値
  let adjustMinutes = 0;
  if (game.parkingOpenAdjustments) {
    const adjustment = game.parkingOpenAdjustments.find((a) => a.parkingId === parking.id);
    if (adjustment) {
      adjustMinutes = adjustment.minutes;
    }
  }

  // 事前予測データの満車時刻が無ければ計算しない
  let predictMinutes = predictsFillMinutes(now, game, parking.predictParkingStates, adjustMinutes);
  if (predictMinutes === 0) {
    return 0;
  }

  // 投稿と同じ駐車率を持つ予測Stateと比較してどれだけ前倒している分を加味する
  const predictSame = parking.predictParkingStates.find(
    (state) => state.ratio === post.parkingRatio
  );
  if (!predictSame) {
    return 0;
  }

  predictMinutes -= predictSame.minutes + adjustMinutes - post.parkingMinutes;
  // 負の数は0にする
  if (predictMinutes < 0) {
    predictMinutes = 0;
  }

  return predictMinutes;
};

export const predictPercent = (
  now: Date,
  gameStart: Date,
  states: ParkingState[],
  adjustMinutes: number
): number => {
  if (states.length === 0) {
    return 0;
  }

  const timeNow = now.getTime();

  // 予測は時系列の昇順で並んでいる前提
  // 最後尾を越えていたら最後尾がそのまま継続しているとして、最後尾を返す
  let predictAbove = states[states.length - 1];
  let dateAbove = new Date(gameStart.getTime());
  dateAbove.setMinutes(dateAbove.getMinutes() + predictAbove.minutes + adjustMinutes);
  if (timeNow >= dateAbove.getTime()) {
    return predictAbove.ratio * 100;
  }

  // 後尾2つ目から探すので必ず2点の補完になる
  for (let i = states.length - 2; i >= 0; i--) {
    let dateBelow = new Date(gameStart.getTime());
    dateBelow.setMinutes(dateBelow.getMinutes() + states[i].minutes + adjustMinutes);

    // 過ぎた地点が下位側
    const timeBelow = dateBelow.getTime();
    const ratioBelow = states[i].ratio;
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

    predictAbove = states[i];
    dateAbove = dateBelow;
  }

  // 予測時間前ということで0
  return 0;
};

export const predictsFillMinutes = (
  now: Date,
  game: Game,
  states: ParkingState[],
  adjustMinutes: number
): number => {
  const nowStartMinutes =
    (game.startAt.getTime() + adjustMinutes * 60 * 1000 - now.getTime()) / 60000;

  // ratio0値があって、それより前は試合開始前なので0を返す
  for (let i = 0; i < states.length; i++) {
    if (states[i].ratio === 0.0) {
      if (nowStartMinutes > Math.abs(states[i].minutes)) {
        return 0;
      } else {
        break;
      }
    }
  }

  for (let i = 0; i < states.length; i++) {
    if (states[i].ratio >= 1.0) {
      let fillMinutes = states[i].minutes;
      fillMinutes += nowStartMinutes;
      // 現在時間を加味して正の数なら、満車時刻より前なのでその分を返す
      // 切り上げ
      return fillMinutes > 0 ? Math.ceil(fillMinutes) : 0;
    }
  }

  return 0;
};
