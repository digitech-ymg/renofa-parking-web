import type { Parking } from "@/types/Parking";
import type { Predict } from "@/types/Predict";

export const suggestMessage = (now: Date, parking: Parking): string => {
  const parkingOpenTime = new Date(parking.openAt);
  const parkingCloseTime = new Date(parking.closeAt);

  if (parking.status === "disable") {
    // 未開放
    return "開放していません。";
  } else if (now.getTime() < parkingOpenTime.getTime()) {
    // 開場前
    return `開場前です。\n${parkingOpenTime.getHours()}時に開場します。`;
  } else if (now.getTime() >= parkingCloseTime.getTime()) {
    // 閉場後
    return "閉場しました。";
  } else {
    if (parking.status === "full") {
      // 満車時
      return "既に満車です。\n他の駐車場をご検討ください。";
    } else {
      // 現状の埋まり具合と予測
      const fullTime = new Date(parking.predicts.slice(-1)[0].at);
      const fullHour = fullTime.getHours();
      const fullMinute = fullTime.getMinutes();
      const percent = suggestPercent(now, parking.predicts);
      if (percent >= 100) {
        return "既に満車です。\n他の駐車場をご検討ください。";
      } else {
        return `現在、${percent}%が埋まっています。\n${fullHour}時${fullMinute}分に満車になりそうです。`;
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
