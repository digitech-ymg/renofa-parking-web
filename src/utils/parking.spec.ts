import type { Parking } from "@/types/Parking";
import { State, parkingState, parkingFillDate } from "./parking";

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
  hourToOpen: 6,
  hourToClose: 2,
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

describe("parkingState", () => {
  it("開場の前日", () => {
    expect(parkingState(new Date("2021-11-27T00:00:00"), parkingBase)).toEqual([
      State.BeforeOpen,
      0,
    ]);
  });

  it("開場の直前", () => {
    expect(parkingState(new Date("2021-11-28T07:59:59"), parkingBase)).toEqual([
      State.BeforeOpen,
      0,
    ]);
  });

  it("開場の直後", () => {
    expect(parkingState(new Date("2021-11-28T08:00:00"), parkingBase)).toEqual([State.Opened, 0]);
  });

  it("開場の予測地点ピッタリ", () => {
    expect(parkingState(new Date("2021-11-28T11:30:00"), parkingBase)).toEqual([State.Opened, 44]);
  });

  it("開場の予測地点中間", () => {
    expect(parkingState(new Date("2021-11-28T11:45:00"), parkingBase)).toEqual([State.Opened, 61]);
  });

  it("開場の満車直前", () => {
    expect(parkingState(new Date("2021-11-28T12:59:59"), parkingBase)).toEqual([State.Opened, 99]);
  });

  it("開場の満車直後", () => {
    expect(parkingState(new Date("2021-11-28T13:00:00"), parkingBase)).toEqual([State.Filled, 100]);
  });

  it("閉場の直後", () => {
    expect(parkingState(new Date("2021-11-28T18:00:00"), parkingBase)).toEqual([
      State.AfterClosed,
      0,
    ]);
  });

  it("開場中だけど、ステータスが満車", () => {
    const parkingFull = Object.assign(parkingBase, { status: "full" });
    expect(parkingState(new Date("2021-11-28T12:00:00"), parkingFull)).toEqual([State.Filled, 100]);
  });

  it("使用できない（予測情報などがあって開場時間中でも無視）", () => {
    const parkingDisable = Object.assign(parkingBase, { status: "disable" });
    expect(parkingState(new Date("2021-11-28T12:00:00"), parkingDisable)).toEqual([
      State.Disable,
      0,
    ]);
  });
});

describe("parkingFillDate", () => {
  it("満車時刻あり", () => {
    expect(parkingFillDate(parkingBase)).toEqual(new Date(2021, 10, 28, 13));
  });

  it("満車時刻なし", () => {
    const parkingNoFill = Object.assign(parkingBase, {
      predicts: [
        { at: "2021-11-28T08:00:00", ratio: 0.0 },
        { at: "2021-11-28T12:00:00", ratio: 0.1 },
        { at: "2021-11-28T13:00:00", ratio: 0.2 },
      ],
    });
    expect(parkingFillDate(parkingBase)).toBeNull();
  });

  it("予測なし", () => {
    const parkingNoFill = Object.assign(parkingBase, { predicts: [] });
    expect(parkingFillDate(parkingBase)).toBeNull();
  });
});
