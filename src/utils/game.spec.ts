import { isOffSeason } from "./game";

describe("isOffSeason関数のテスト", () => {
  it("日付が29日離れている場合、false", () => {
    const today = new Date("2023-01-01");
    const nextGameDay = new Date("2023-01-30");
    expect(isOffSeason(today, nextGameDay)).toBe(false);
  });

  it("日付が30日離れている場合、true", () => {
    const today = new Date("2023-01-01");
    const nextGameDay = new Date("2023-01-31");
    expect(isOffSeason(today, nextGameDay)).toBe(true);
  });

  it("日付が30日離れている場合（引数が逆）、true", () => {
    const today = new Date("2023-01-31");
    const nextGameDay = new Date("2023-01-01");
    expect(isOffSeason(today, nextGameDay)).toBe(true);
  });

  it("日付が1日離れている場合（引数が逆）、true", () => {
    const today = new Date("2023-01-31");
    const nextGameDay = new Date("2023-01-30");
    expect(isOffSeason(today, nextGameDay)).toBe(true);
  });

  it("日付が31日離れている場合、true", () => {
    const today = new Date("2023-01-01");
    const nextGameDay = new Date("2023-02-01");
    expect(isOffSeason(today, nextGameDay)).toBe(true);
  });

  it("日付が同じ場合、false", () => {
    const today = new Date("2023-01-01");
    const nextGameDay = new Date("2023-01-01");
    expect(isOffSeason(today, nextGameDay)).toBe(false);
  });

  it("日付が年を跨いで30日離れている場合、true", () => {
    const today = new Date("2022-12-02");
    const nextGameDay = new Date("2023-01-01");
    expect(isOffSeason(today, nextGameDay)).toBe(true);
  });

  it("日付が同じで試合時間の前、false", () => {
    const today = new Date("2023-05-03T12:00:00");
    const nextGameDay = new Date("2023-05-03T14:00:00");
    expect(isOffSeason(today, nextGameDay)).toBe(false);
  });

  it("日付が同じで試合時間の後、false", () => {
    const today = new Date("2023-05-03T15:00:00");
    const nextGameDay = new Date("2023-05-03T14:00:00");
    expect(isOffSeason(today, nextGameDay)).toBe(false);
  });
});
