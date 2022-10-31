import type { Game } from "@/types/Game";
import type { Post } from "@/types/Post";
import { judgeUserTitle } from "./user";

const games: Game[] = [
  {
    id: "20211125",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "win",
    goalScore: 0,
    goalAgainst: 0,
  },
  {
    id: "20211126",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "win",
    goalScore: 0,
    goalAgainst: 0,
  },
  {
    id: "20211127",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "draw",
    goalScore: 0,
    goalAgainst: 0,
  },
  {
    id: "20211128",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "draw",
    goalScore: 0,
    goalAgainst: 0,
  },
  {
    id: "20211129",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "lose",
    goalScore: 0,
    goalAgainst: 0,
  },
  {
    id: "20211130",
    kind: "明治安田生命J2リーグ",
    section: "第1節",
    startAt: new Date("2021-11-28T14:00:00"),
    finishAt: new Date("2021-11-28T16:00:00"),
    opponent: "ロアッソ熊本",
    availableParkings: ["paid", "ja", "truck", "riverbed"],
    soldOutParkings: ["paid"],
    attendance: 0,
    result: "lose",
    goalScore: 0,
    goalAgainst: 0,
  },
];

const user1_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211127",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211128",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211129",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211130",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user2_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211127",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user3_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211127",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211128",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211129",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user4_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211128",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211129",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211130",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user5_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "paid",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user6_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "ja",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "ja",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user7_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "riverbed",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "riverbed",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user8_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "truck",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
  {
    nickname: "aaa",
    gameId: "20211126",
    parkingId: "truck",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user9_posts: Post[] = [
  {
    nickname: "aaa",
    gameId: "20211125",
    parkingId: "truck",
    parkingRatio: 10,
    parkingMinutes: 10,
    parkedAgo: 10,
    parkedAt: new Date("2021-11-28T14:00:00"),
    postedAt: new Date("2021-11-28T14:00:00"),
    userId: "123",
  },
];

const user10_posts: Post[] = [];

//test
describe("ユーザー称号", () => {
  it("3: 超絶コアサポーター", () => {
    expect(judgeUserTitle(games, user1_posts)).toEqual(3);
  });

  it("4: ありがとう勝ち運サポーター", () => {
    expect(judgeUserTitle(games, user2_posts)).toEqual(4);
  });

  it("5: 負けない事が大事サポーター", () => {
    expect(judgeUserTitle(games, user3_posts)).toEqual(5);
  });

  it("6: 涙の数だけ強くなるサポーター", () => {
    expect(judgeUserTitle(games, user4_posts)).toEqual(6);
  });

  it("7: 有料優良サポーター", () => {
    expect(judgeUserTitle(games, user5_posts)).toEqual(7);
  });

  it("8: 近いところが好きサポーター", () => {
    expect(judgeUserTitle(games, user6_posts)).toEqual(8);
  });

  it("9: 橋を渡ってくるサポーター", () => {
    expect(judgeUserTitle(games, user7_posts)).toEqual(9);
  });

  it("10: トラック協会ありがとうサポーター", () => {
    expect(judgeUserTitle(games, user8_posts)).toEqual(10);
  });

  it("11: 駐車場協力始めましたサポーター", () => {
    expect(judgeUserTitle(games, user9_posts)).toEqual(11);
  });

  it("12: 期待の新人サポーター", () => {
    expect(judgeUserTitle(games, user10_posts)).toEqual(12);
  });
});
