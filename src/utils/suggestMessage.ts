import type { Parking } from "@/types/Parking";
import type { Predict } from "@/types/Predict";

export const suggestMessage = (now: Date, parking: Parking): string => {
  const parkingOpenTime = new Date(parking.openAt);
  const parkingCloseTime = new Date(parking.closeAt);

  if (now.getTime() < parkingOpenTime.getTime()) {
    // 開場前
    return `開場前です。\n${parkingOpenTime.getHours()}時に開場します。`;
  } else if (now.getTime() > parkingCloseTime.getTime()) {
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
      return `現在、${percent}%が埋まっています。\n${fullHour}時${fullMinute}分に満車になりそうです。`;
    }
  }
};

const suggestPercent = (now: Date, predicts: Predict[]): number => {
  let percent: number = 0;

  for (let i = 0; i < predicts.length; i++) {
    const predictDate = new Date(predicts[i].at);
    if (now.getTime() < predictDate.getTime()) {
      percent = predicts[i].ratio * 100;
      break;
    }
  }

  return percent;
};
