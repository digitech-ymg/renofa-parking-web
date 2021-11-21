import type { Parking } from "@/types/Parking";
import type { Predict } from "@/types/Predict";
import { suggestMessage } from "./suggestMessage";

const parkingBase: Parking = {
  key: "truck",
  name: "トラック協会",
  officialName: "山口県トラック協会臨時駐車場",
  address: "山口市宝町２−８４",
  carCapacity: 100,
  distanceToStadium: 1300,
  timeToStadium: 16,
  latitude: 34.158161,
  longitude: 131.4450973,
  openAt: "2021-11-28T08:00:00",
  closeAt: "2021-11-28T18:00:00",
  status: "enable",
  predicts: [
    { at: "2021-11-28T08:00:00", ratio: 0.0 },
    { at: "2021-11-28T08:30:00", ratio: 0.01 },
    { at: "2021-11-28T09:00:00", ratio: 0.02 },
    { at: "2021-11-28T09:30:00", ratio: 0.03 },
    { at: "2021-11-28T10:00:00", ratio: 0.05 },
    { at: "2021-11-28T10:30:00", ratio: 0.1 },
    { at: "2021-11-28T11:00:00", ratio: 0.16 },
    { at: "2021-11-28T11:30:00", ratio: 0.44 },
    { at: "2021-11-28T12:00:00", ratio: 0.78 },
    { at: "2021-11-28T12:30:00", ratio: 0.93 },
    { at: "2021-11-28T13:00:00", ratio: 1.0 },
  ],
  images: ["/img/parking-truck1.jpg", "/img/parking-truck2.jpg"],
};

describe("suggestMessage", () => {
  it("開場の前日", () => {
    expect(suggestMessage(new Date("2021-11-27T00:00:00"), parkingBase)).toBe(
      "開場前です。\n8時に開場します。"
    );
  });

  it("開場の直前", () => {
    expect(suggestMessage(new Date("2021-11-28T07:59:59"), parkingBase)).toBe(
      "開場前です。\n8時に開場します。"
    );
  });

  it("開場の直後", () => {
    expect(suggestMessage(new Date("2021-11-28T08:00:00"), parkingBase)).toBe(
      "現在、0%が埋まっています。\n13時0分に満車になりそうです。"
    );
  });

  it("開場の中間", () => {
    expect(suggestMessage(new Date("2021-11-28T11:30:00"), parkingBase)).toBe(
      "現在、44%が埋まっています。\n13時0分に満車になりそうです。"
    );
  });

  it("開場の満車直前", () => {
    expect(suggestMessage(new Date("2021-11-28T12:59:59"), parkingBase)).toBe(
      "現在、93%が埋まっています。\n13時0分に満車になりそうです。"
    );
  });

  it("開場の満車直後", () => {
    expect(suggestMessage(new Date("2021-11-28T13:00:00"), parkingBase)).toBe(
      "既に満車です。\n他の駐車場をご検討ください。"
    );
  });

  it("閉場の直後", () => {
    expect(suggestMessage(new Date("2021-11-28T18:00:00"), parkingBase)).toBe("閉場しました。");
  });

  it("開場中だけど、ステータスが満車", () => {
    const parkingFull = Object.assign(parkingBase, { status: "full" });
    expect(suggestMessage(new Date("2021-11-28T12:00:00"), parkingFull)).toBe(
      "既に満車です。\n他の駐車場をご検討ください。"
    );
  });

  it("使用できない（予測情報などがあって開場時間中でも無視）", () => {
    const parkingDisable = Object.assign(parkingBase, { status: "disable" });
    expect(suggestMessage(new Date("2021-11-28T12:00:00"), parkingDisable)).toBe(
      "開放していません。"
    );
  });
});
