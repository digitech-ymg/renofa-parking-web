import { isOffSeason } from "./game";

describe("isOffSeason関数のテスト", () => {
  // 日付が29日離れている場合
  it("日付が29日離れている場合、false", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-30");
    expect(isOffSeason(date1, date2)).toBe(false);
  });

  // 日付が30日離れている場合
  it("日付が30日離れている場合、true", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-31");
    expect(isOffSeason(date1, date2)).toBe(true);
  });

  // 日付が31日離れている場合
  it("日付が31日離れている場合、true", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-02-01");
    expect(isOffSeason(date1, date2)).toBe(true);
  });

  // 日付が同じ場合
  it("日付が同じ場合、false", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-01");
    expect(isOffSeason(date1, date2)).toBe(false);
  });

  // 日付が年度を跨いで30日離れている場合
  it("日付が年度を跨いで30日離れている場合、true", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-02-01");
    expect(isOffSeason(date1, date2)).toBe(true);
  });
});
