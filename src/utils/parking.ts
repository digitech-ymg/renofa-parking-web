import type { Parking, ParkingStatus } from "@/types/Parking";
import type { Predict } from "@/types/Predict";

export const parkingStatus = (now: Date, parking: Parking): ParkingStatus => {
  if (parking.status === "disable") {
    // 未開放
    return { state: "disable", percent: 0 };
  } else if (now.getTime() < new Date(parking.openAt).getTime()) {
    // 開場前
    return { state: "beforeOpen", percent: 0 };
  } else if (now.getTime() >= new Date(parking.closeAt).getTime()) {
    const close = parking.closeAt;
    // 閉場後
    return { state: "afterClosed", percent: 0 };
  } else {
    if (parking.status === "full") {
      // 満車時
      return { state: "filled", percent: 100 };
    } else {
      // 現状の埋まり具合と予測
      const percent = suggestPercent(now, parking.predicts);
      if (percent >= 100) {
        return { state: "filled", percent: 100 };
      } else {
        return { state: "opened", percent: percent };
      }
    }
  }
};

const suggestPercent = (now: Date, predicts: Predict[]): number => {
  if (predicts.length === 0) {
    return 0;
  }

  const timeNow = now.getTime();

  // 予測は時系列の昇順で並んでいる前提
  // 最後尾を越えていたら最後尾がそのまま継続しているとして、最後尾を返す
  let predictAbove = predicts[predicts.length - 1];
  if (timeNow >= new Date(predictAbove.at).getTime()) {
    return predictAbove.ratio * 100;
  }

  // 後尾2つ目から探すので必ず2点の補完になる
  for (let i = predicts.length - 2; i >= 0; i--) {
    // 過ぎた地点が下位側
    const timeBelow = new Date(predicts[i].at).getTime();
    const ratioBelow = predicts[i].ratio;
    if (timeNow >= timeBelow) {
      // 過ぎてない地点が上位側
      const timeAbove = new Date(predictAbove.at).getTime();
      const ratioAbove = predictAbove.ratio;
      // 線形補完
      const weightBelow = (timeAbove - timeNow) / (timeAbove - timeBelow);
      const weightAbove = (timeNow - timeBelow) / (timeAbove - timeBelow);
      const ratio = ratioBelow * weightBelow + ratioAbove * weightAbove;
      return Math.floor(ratio * 100);
    }

    predictAbove = predicts[i];
  }

  // 予測時間前ということで0
  return 0;
};

export const parkingFillDate = (parking: Parking): Date | null => {
  for (let i = 0; i < parking.predicts.length; i++) {
    if (parking.predicts[i].ratio >= 1.0) {
      return new Date(parking.predicts[i].at);
    }
  }

  return null;
};
