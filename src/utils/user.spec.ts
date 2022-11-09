import type { Game } from "@/types/Game";
import type { Post } from "@/types/Post";
import { judgeUserTitle } from "./user";

const GAMEID_WIN1 = "20211125";
const GAMEID_WIN2 = "20211126";
const GAMEID_DRAW1 = "20211127";
const GAMEID_DRAW2 = "20211128";
const GAMEID_LOSE1 = "20211129";
const GAMEID_LOSE2 = "20211130";

const RESULT_WIN = "win";
const RESULT_DRAW = "draw";
const RESULT_LOSE = "lose";

const genGame = (id: string, result: string): Game => {
  return {
    id: id,
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: result,
    goalScore: 0,
    goalAgainst: 0,
  };
};

const genPost = (gameId: string, parkingId: string): Post => {
  return {
    nickname: "aaa",
    gameId: gameId,
    parkingId: parkingId,
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  };
};

const games: Game[] = [
  genGame(GAMEID_WIN1, RESULT_WIN),
  genGame(GAMEID_WIN2, RESULT_WIN),
  genGame(GAMEID_DRAW1, RESULT_DRAW),
  genGame(GAMEID_DRAW2, RESULT_DRAW),
  genGame(GAMEID_LOSE1, RESULT_LOSE),
  genGame(GAMEID_LOSE2, RESULT_LOSE),
];

//test
describe("ユーザー称号", () => {
  it("超絶コアサポーター", () => {
    expect(
      judgeUserTitle(games, [
        genPost(GAMEID_WIN1, "paid"),
        genPost(GAMEID_WIN2, "paid"),
        genPost(GAMEID_DRAW1, "paid"),
        genPost(GAMEID_DRAW2, "paid"),
        genPost(GAMEID_LOSE1, "paid"),
        genPost(GAMEID_LOSE2, "paid"),
      ])
    ).toEqual(0);
  });

  it("ありがとう勝ち運サポーター", () => {
    expect(
      judgeUserTitle(games, [
        genPost(GAMEID_WIN1, "paid"),
        genPost(GAMEID_WIN2, "paid"),
        genPost(GAMEID_DRAW1, "paid"),
      ])
    ).toEqual(1);
  });

  it("負けない事が大事サポーター", () => {
    expect(
      judgeUserTitle(games, [
        genPost(GAMEID_WIN1, "paid"),
        genPost(GAMEID_DRAW1, "paid"),
        genPost(GAMEID_DRAW2, "paid"),
      ])
    ).toEqual(2);
  });

  it("涙の数だけ強くなるサポーター", () => {
    expect(
      judgeUserTitle(games, [
        genPost(GAMEID_WIN1, "paid"),
        genPost(GAMEID_LOSE1, "paid"),
        genPost(GAMEID_LOSE2, "paid"),
      ])
    ).toEqual(3);
  });

  it("有料優良サポーター", () => {
    expect(
      judgeUserTitle(games, [genPost(GAMEID_WIN1, "paid"), genPost(GAMEID_WIN2, "paid")])
    ).toEqual(4);
  });

  it("近いところが好きサポーター", () => {
    expect(judgeUserTitle(games, [genPost(GAMEID_WIN1, "ja"), genPost(GAMEID_WIN2, "ja")])).toEqual(
      5
    );
  });

  it("橋を渡ってくるサポーター", () => {
    expect(
      judgeUserTitle(games, [genPost(GAMEID_WIN1, "riverbed"), genPost(GAMEID_WIN2, "riverbed")])
    ).toEqual(6);
  });

  it("トラック協会ありがとうサポーター", () => {
    expect(
      judgeUserTitle(games, [genPost(GAMEID_WIN1, "truck"), genPost(GAMEID_WIN2, "truck")])
    ).toEqual(7);
  });

  it("駐車場協力始めましたサポーター", () => {
    expect(judgeUserTitle(games, [genPost(GAMEID_WIN1, "paid")])).toEqual(8);
  });

  it("期待の新人サポーター", () => {
    expect(judgeUserTitle(games, [])).toEqual(9);
  });
});
