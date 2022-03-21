import type { Game } from "@/types/Game";
import type { Parking } from "@/types/Parking";
import { parkingStatus, parkingFillDate } from "./parking";

const game: Game = {
  id: "20211128",
  kind: "明治安田生命J2リーグ",
  section: "第1節",
  partner: "",
  thanksday: "",
  startAt: new Date(2021, 10, 28, 14), // 2021-11-28T14:00:00/JST
  finishAt: new Date(2021, 10, 28, 16), // 2021-11-28T16:00:00/JST
  opponent: "ロアッソ熊本",
  availableParkings: ["paid", "ja", "truck", "riverbed"],
};

const parkingBase: Parking = {
  id: "truck",
  name: "トラック協会",
  officialName: "山口県トラック協会臨時駐車場",
  address: "山口市宝町２−８４",
  carCapacity: 100,
  distanceToStadium: 1300,
  timeToStadium: 16,
  latitude: 34.158161,
  longitude: 131.4450973,
  routeUrl: "https://...",
  hourToOpen: 6,
  hourToClose: 2,
  status: "enable",
  predicts: [
    { minutes: -360, ratio: 0.0 },
    { minutes: -330, ratio: 0.01 },
    { minutes: -300, ratio: 0.02 },
    { minutes: -270, ratio: 0.03 },
    { minutes: -240, ratio: 0.05 },
    { minutes: -210, ratio: 0.1 },
    { minutes: -180, ratio: 0.16 },
    { minutes: -150, ratio: 0.44 },
    { minutes: -120, ratio: 0.78 },
    { minutes: -90, ratio: 0.93 },
    { minutes: -60, ratio: 1.0 },
  ],
  images: ["/img/parking-truck1.jpg", "/img/parking-truck2.jpg"],
};

describe("parkingStatus", () => {
  it("開場の前日", () => {
    expect(parkingStatus(new Date("2021-11-27T00:00:00"), game, parkingBase)).toMatchObject({
      state: "beforeOpen",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("開場の直前", () => {
    expect(parkingStatus(new Date("2021-11-28T07:59:59"), game, parkingBase)).toMatchObject({
      state: "beforeOpen",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("開場の直後", () => {
    expect(parkingStatus(new Date("2021-11-28T08:00:00"), game, parkingBase)).toMatchObject({
      state: "opened",
      percent: 0,
      fillMinutes: 300,
    });
  });

  it("開場の予測地点ピッタリ", () => {
    expect(parkingStatus(new Date("2021-11-28T11:30:00"), game, parkingBase)).toMatchObject({
      state: "opened",
      percent: 44,
      fillMinutes: 90,
    });
  });

  it("開場の予測地点中間", () => {
    expect(parkingStatus(new Date("2021-11-28T11:45:00"), game, parkingBase)).toMatchObject({
      state: "opened",
      percent: 61,
      fillMinutes: 75,
    });
  });

  it("開場の満車直前", () => {
    expect(parkingStatus(new Date("2021-11-28T12:59:59"), game, parkingBase)).toMatchObject({
      state: "opened",
      percent: 99,
      fillMinutes: 1,
    });
  });

  it("開場の満車直後", () => {
    expect(parkingStatus(new Date("2021-11-28T13:00:00"), game, parkingBase)).toMatchObject({
      state: "filled",
      percent: 100,
      fillMinutes: 0,
    });
  });

  it("閉場の直後", () => {
    expect(parkingStatus(new Date("2021-11-28T18:00:00"), game, parkingBase)).toMatchObject({
      state: "afterClosed",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("開場中だけど、ステータスが満車", () => {
    const parkingFull = Object.assign(parkingBase, { status: "full" });
    expect(parkingStatus(new Date("2021-11-28T12:00:00"), game, parkingFull)).toMatchObject({
      state: "filled",
      percent: 100,
      fillMinutes: 0,
    });
  });

  it("使用できない（予測情報などがあって開場時間中でも無視）", () => {
    const parkingDisable = Object.assign(parkingBase, { status: "disable" });
    expect(parkingStatus(new Date("2021-11-28T12:00:00"), game, parkingDisable)).toMatchObject({
      state: "disable",
      percent: 0,
      fillMinutes: 0,
    });
  });
});

describe("parkingFillDate", () => {
  it("満車時刻あり", () => {
    expect(parkingFillDate(game, parkingBase)).toEqual(new Date(2021, 10, 28, 13));
  });

  it("満車時刻なし", () => {
    const parkingNoFill = Object.assign(parkingBase, {
      predicts: [
        { minutes: -360, ratio: 0.0 },
        { minutes: -120, ratio: 0.1 },
        { minutes: -60, ratio: 0.2 },
      ],
    });
    expect(parkingFillDate(game, parkingBase)).toBeNull();
  });

  it("予測なし", () => {
    const parkingNoFill = Object.assign(parkingBase, { predicts: [] });
    expect(parkingFillDate(game, parkingBase)).toBeNull();
  });
});
