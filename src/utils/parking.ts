import type { Game } from "@/types/Game";
import type { Parking, ParkingStatus } from "@/types/Parking";
import type { Predict } from "@/types/Predict";

export const parkingStatus = (now: Date, game: Game, parking: Parking): ParkingStatus => {
  const openDate = new Date(game.startAt);
  openDate.setHours(openDate.getHours() - parking.hourToOpen);

  const closeDate = new Date(game.finishAt);
  closeDate.setHours(closeDate.getHours() + parking.hourToClose);

  if (parking.status === "disable") {
    // 未開放
    return { state: "disable", percent: 0 };
  } else if (now.getTime() < openDate.getTime()) {
    // 開場前
    return { state: "beforeOpen", percent: 0 };
  } else if (now.getTime() >= closeDate.getTime()) {
    // 閉場後
    return { state: "afterClosed", percent: 0 };
  } else {
    if (parking.status === "full") {
      // 満車時
      return { state: "filled", percent: 100 };
    } else {
      // 現状の埋まり具合と予測
      const percent = suggestPercent(now, new Date(game.startAt), parking.predicts);
      if (percent >= 100) {
        return { state: "filled", percent: 100 };
      } else {
        return { state: "opened", percent: percent };
      }
    }
  }
};

const suggestPercent = (now: Date, gameStart: Date, predicts: Predict[]): number => {
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

export const parkingFillDate = (game: Game, parking: Parking): Date | null => {
  for (let i = 0; i < parking.predicts.length; i++) {
    if (parking.predicts[i].ratio >= 1.0) {
      const date = new Date(game.startAt);
      date.setMinutes(date.getMinutes() + parking.predicts[i].minutes);
      return date;
    }
  }

  return null;
};
