import type { Game } from "@/types/Game";
import type { Parking } from "@/types/Parking";
import { Post } from "@/types/Post";
import {
  parkingStatus,
  selectPostForCalc,
  postPercent,
  postFillMinutes,
  predictPercent,
  predictsFillMinutes,
} from "./parking";

const game: Game = {
  id: "20211128",
  kind: "明治安田生命J2リーグ",
  section: "第1節",
  startAt: new Date("2021-11-28T14:00:00"),
  finishAt: new Date("2021-11-28T16:00:00"),
  opponent: "ロアッソ熊本",
  availableParkings: ["paid", "ja", "truck", "riverbed"],
  soldOutParkings: ["paid"],
};

const parkingWillFill: Parking = {
  id: "ja",
  name: "ja山口",
  officialName: "JA山口県 山口統括本部支社臨時駐車場",
  address: "山口市維新公園3丁目11−1",
  carCapacity: 100,
  distanceToStadium: 90,
  timeToStadium: 2,
  latitude: 34.1532814,
  longitude: 131.4396906,
  routeUrl: "https://...",
  hourToOpen: 3,
  hourToClose: 2,
  predictParkingStates: [
    { minutes: -180, ratio: 0.0 },
    { minutes: -175, ratio: 0.5 },
    { minutes: -165, ratio: 0.8 },
    { minutes: -150, ratio: 1.0 },
  ],
  adoptionParkingStates: [
    { minutes: -180, ratio: 0.1 },
    { minutes: -175, ratio: 0.5 },
    { minutes: -170, ratio: 0.8 },
    { minutes: -165, ratio: 1.0 },
  ],
  images: ["/img/parking-ja.jpg", "/img/parking-ja2.jpg"],
};

const parkingWontFill: Parking = {
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
  predictParkingStates: [
    { minutes: -360, ratio: 0.0 },
    { minutes: -165, ratio: 0.1 },
    { minutes: -150, ratio: 0.5 },
    { minutes: -120, ratio: 0.8 },
    { minutes: -60, ratio: 0.9 },
  ],
  adoptionParkingStates: [
    { minutes: -360, ratio: 0.1 },
    { minutes: -210, ratio: 0.5 },
    { minutes: -180, ratio: 0.8 },
    { minutes: -120, ratio: 1.0 },
  ],
  images: ["/img/parking-truck1.jpg", "/img/parking-truck2.jpg"],
};

const emptyPosts: Post[] = [];

const postBase = {
  nickname: "hoge",
  gameId: "20211128",
  parkingId: "truck",
  parkedAgo: 0, // not use for test
  parkedAt: new Date(), // not use for test
  postedAt: new Date(), // not use for test
};

// --------------------------------------------------------

describe("parkingStatus", () => {
  describe("使用できない駐車場", () => {
    const parkingDisable = Object.assign({}, parkingWillFill, { id: "panasonic" });
    test.each`
      label           | now                                | state        | percent | fillMinutes
      ${"開場の前日"} | ${new Date("2021-11-27T12:00:00")} | ${"disable"} | ${0}    | ${0}
      ${"開場の当日"} | ${new Date("2021-11-28T12:00:00")} | ${"disable"} | ${0}    | ${0}
    `("$label", ({ label, now, state, percent, fillMinutes }) => {
      expect(parkingStatus(now, game, parkingDisable, emptyPosts)).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });

  describe("完売した駐車場", () => {
    const parkingSoldOut = Object.assign({}, parkingWillFill, { id: "paid" });
    test.each`
      label           | now                                | state        | percent | fillMinutes
      ${"開場の前日"} | ${new Date("2021-11-27T12:00:00")} | ${"soldOut"} | ${0}    | ${0}
      ${"開場の当日"} | ${new Date("2021-11-28T12:00:00")} | ${"soldOut"} | ${0}    | ${0}
    `("$label", ({ label, now, state, percent, fillMinutes }) => {
      expect(parkingStatus(now, game, parkingSoldOut, emptyPosts)).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });

  describe("投稿なし/満車の予測データあり駐車場", () => {
    test.each`
      label                     | now                                | state            | percent | fillMinutes
      ${"開場の前日"}           | ${new Date("2021-11-27T00:00:00")} | ${"beforeOpen"}  | ${0}    | ${0}
      ${"開場の直前"}           | ${new Date("2021-11-28T10:59:59")} | ${"beforeOpen"}  | ${0}    | ${0}
      ${"開場の直後"}           | ${new Date("2021-11-28T11:00:00")} | ${"opened"}      | ${0}    | ${30}
      ${"開場の駐車率中間"}     | ${new Date("2021-11-28T11:15:00")} | ${"opened"}      | ${80}   | ${15}
      ${"満車予測地点ぴったり"} | ${new Date("2021-11-28T11:30:00")} | ${"filled"}      | ${100}  | ${0}
      ${"満車予測地点以降"}     | ${new Date("2021-11-28T13:00:00")} | ${"filled"}      | ${100}  | ${0}
      ${"閉場の直後"}           | ${new Date("2021-11-28T18:00:00")} | ${"afterClosed"} | ${0}    | ${0}
      ${"満車予測地点以降"}     | ${new Date("2021-11-28T13:00:00")} | ${"filled"}      | ${100}  | ${0}
    `("$label", ({ label, now, state, percent, fillMinutes }) => {
      expect(parkingStatus(now, game, parkingWillFill, emptyPosts)).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });

  describe("投稿なし/満車の予測データなし駐車場", () => {
    test.each`
      label                         | now                                | state       | percent | fillMinutes
      ${"最後の予測点時間ぴったり"} | ${new Date("2021-11-28T13:00:00")} | ${"opened"} | ${90}   | ${0}
      ${"最後の予測点時間以降"}     | ${new Date("2021-11-28T13:30:00")} | ${"opened"} | ${90}   | ${0}
    `("$label", ({ label, now, state, percent, fillMinutes }) => {
      expect(parkingStatus(now, game, parkingWontFill, emptyPosts)).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });

  describe("投稿あり/満車の予測データなし駐車場", () => {
    test.each`
      label                        | minutes | ratio  | now                                | state       | percent | fillMinutes
      ${"0.1投稿の不採用"}         | ${-250} | ${0.1} | ${new Date("2021-11-28T12:00:00")} | ${"opened"} | ${80}   | ${0}
      ${"0.5投稿の直後"}           | ${-150} | ${0.5} | ${new Date("2021-11-28T11:30:00")} | ${"opened"} | ${50}   | ${0}
      ${"0.5投稿の20分後"}         | ${-150} | ${0.5} | ${new Date("2021-11-28T11:50:00")} | ${"opened"} | ${70}   | ${0}
      ${"0.5投稿の試合開始直後"}   | ${-150} | ${0.5} | ${new Date("2021-11-28T14:00:00")} | ${"opened"} | ${80}   | ${0}
      ${"0.5投稿の試合開始20分後"} | ${-150} | ${0.5} | ${new Date("2021-11-28T14:20:00")} | ${"opened"} | ${80}   | ${0}
      ${"1.0投稿の直後"}           | ${-70}  | ${1.0} | ${new Date("2021-11-28T12:50:00")} | ${"filled"} | ${100}  | ${0}
      ${"1.0投稿の20分後"}         | ${-70}  | ${1.0} | ${new Date("2021-11-28T13:10:00")} | ${"filled"} | ${100}  | ${0}
    `("$label", ({ label, minutes, ratio, now, state, percent, fillMinutes }) => {
      expect(
        parkingStatus(now, game, parkingWontFill, [
          Object.assign({}, postBase, { parkingMinutes: minutes, parkingRatio: ratio }),
        ])
      ).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });

  describe("投稿あり/満車の予測データあり駐車場", () => {
    test.each`
      label                      | minutes | ratio  | now                                | state       | percent | fillMinutes
      ${"0.8投稿の投稿直後"}     | ${-170} | ${0.8} | ${new Date("2021-11-28T11:10:00")} | ${"opened"} | ${80}   | ${15}
      ${"0.8投稿の投稿10分後"}   | ${-170} | ${0.8} | ${new Date("2021-11-28T11:20:00")} | ${"opened"} | ${93}   | ${5}
      ${"0.8投稿の満車時間直後"} | ${-170} | ${0.8} | ${new Date("2021-11-28T11:25:00")} | ${"filled"} | ${100}  | ${0}
      ${"0.8投稿の試合開始直後"} | ${-170} | ${0.8} | ${new Date("2021-11-28T14:00:00")} | ${"filled"} | ${100}  | ${0}
      ${"0.8投稿の投稿直後"}     | ${-170} | ${0.8} | ${new Date("2021-11-28T11:10:00")} | ${"opened"} | ${80}   | ${15}
      ${"1.0投稿の直後"}         | ${-160} | ${1.0} | ${new Date("2021-11-28T11:20:00")} | ${"filled"} | ${100}  | ${0}
      ${"1.0投稿の20分後"}       | ${-160} | ${1.0} | ${new Date("2021-11-28T11:40:00")} | ${"filled"} | ${100}  | ${0}
    `("$label", ({ label, minutes, ratio, now, state, percent, fillMinutes }) => {
      expect(
        parkingStatus(now, game, parkingWillFill, [
          Object.assign({}, postBase, { parkingMinutes: minutes, parkingRatio: ratio }),
        ])
      ).toMatchObject({
        state: state,
        percent: percent,
        fillMinutes: fillMinutes,
      });
    });
  });
});

// --------------------------------------------------------

describe("selectPostForCalc", () => {
  it("投稿なし", () => {
    expect(selectPostForCalc(game, parkingWontFill, [])).toEqual(null);
  });

  it("駐車開始点以前", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -400 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.1(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -300 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.5(不正)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -211 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.5(不正), 0.5(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -211 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 })
    );
  });

  it("[0.5(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 })
    );
  });

  it("[0,1(不採用), 0.5(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -300 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 })
    );
  });

  it("[0,1(不採用), 0.5(採用), 0.5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -300 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -190 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 })
    );
  });

  it("[0,5(採用), 0.5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -190 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 })
    );
  });

  it("[0,5(不採用), 0.8(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 })
    );
  });

  it("[0,5(不採用), 0.8(採用), 0,5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -170 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 })
    );
  });

  it("[0,5(不採用), 0.8(採用), 0.8(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -170 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 })
    );
  });

  it("[0,5(不採用), 0.8(不採用), 1.0(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -120 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -120 })
    );
  });

  it("[0,5(不採用), 0.8(不採用), 1.0(採用), 1.0(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -120 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -100 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -120 })
    );
  });

  it("[1.0(不正), 0,5(不採用), 0.8(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -230 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -210 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -180 })
    );
  });
});

// --------------------------------------------------------

describe("postPercent", () => {
  describe("満車の予測データなし駐車場（データありも内包）", () => {
    test.each`
      label                         | postMinutes | postRatio | now                                | expected
      ${"0.5投稿の直後"}            | ${-180}     | ${0.5}    | ${new Date("2021-11-28T11:00:00")} | ${50}
      ${"0.5投稿の10分後"}          | ${-180}     | ${0.5}    | ${new Date("2021-11-28T11:10:00")} | ${60}
      ${"0.5投稿の試合開始直後"}    | ${-180}     | ${0.5}    | ${new Date("2021-11-28T14:00:00")} | ${80}
      ${"0.5投稿の試合開始30分後"}  | ${-180}     | ${0.5}    | ${new Date("2021-11-28T14:30:00")} | ${80}
      ${"満車投稿の直後"}           | ${-90}      | ${1.0}    | ${new Date("2021-11-28T12:30:00")} | ${100}
      ${"満車投稿の10分後"}         | ${-90}      | ${1.0}    | ${new Date("2021-11-28T12:40:00")} | ${100}
      ${"満車投稿の試合開始直後"}   | ${-90}      | ${1.0}    | ${new Date("2021-11-28T14:00:00")} | ${100}
      ${"満車投稿の試合開始30分後"} | ${-90}      | ${1.0}    | ${new Date("2021-11-28T14:30:00")} | ${100}
    `("$label", ({ label, now, postMinutes, postRatio, expected }) => {
      expect(
        postPercent(
          now,
          parkingWontFill,
          game.startAt,
          Object.assign({}, postBase, { parkingRatio: postRatio, parkingMinutes: postMinutes })
        )
      ).toEqual(expected);
    });
  });
});

// --------------------------------------------------------

describe("postFillMinutes", () => {
  describe("満車の予測データなし駐車場", () => {
    test.each`
      label                | postMinutes | postRatio | now                                | expected
      ${"満車投稿直後"}    | ${-90}      | ${1.0}    | ${new Date("2021-11-28T13:00:00")} | ${0}
      ${"0.8投稿直後満"}   | ${-150}     | ${0.8}    | ${new Date("2021-11-28T11:30:00")} | ${0}
      ${"0.8投稿から10分"} | ${-150}     | ${0.8}    | ${new Date("2021-11-28T11:40:00")} | ${0}
    `("$label", ({ label, now, postMinutes, postRatio, expected }) => {
      expect(
        postFillMinutes(
          now,
          game,
          parkingWontFill,
          Object.assign({}, postBase, { parkingRatio: postRatio, parkingMinutes: postMinutes })
        )
      ).toEqual(expected);
    });
  });

  describe("満車の予測データあり駐車場", () => {
    test.each`
      label                      | postMinutes | postRatio | now                                | expected
      ${"満車投稿直後"}          | ${-160}     | ${1.0}    | ${new Date("2021-11-28T11:25:00")} | ${0}
      ${"満車投稿から30分"}      | ${-160}     | ${1.0}    | ${new Date("2021-11-28T11:55:00")} | ${0}
      ${"0.5投稿直後満"}         | ${-180}     | ${0.5}    | ${new Date("2021-11-28T11:00:00")} | ${25}
      ${"0.5投稿から5分"}        | ${-180}     | ${0.5}    | ${new Date("2021-11-28T11:05:00")} | ${20}
      ${"0.5投稿から満車時刻"}   | ${-180}     | ${0.5}    | ${new Date("2021-11-28T11:25:00")} | ${0}
      ${"0.5投稿から満車後30分"} | ${-180}     | ${0.5}    | ${new Date("2021-11-28T12:55:00")} | ${0}
      ${"0.8投稿直後満"}         | ${-170}     | ${0.8}    | ${new Date("2021-11-28T11:10:00")} | ${15}
      ${"0.8投稿から10分"}       | ${-170}     | ${0.8}    | ${new Date("2021-11-28T11:15:00")} | ${10}
      ${"0.8投稿から満車時刻"}   | ${-170}     | ${0.8}    | ${new Date("2021-11-28T11:25:00")} | ${0}
      ${"0.8投稿から満車後60分"} | ${-170}     | ${0.8}    | ${new Date("2021-11-28T12:25:00")} | ${0}
    `("$label", ({ label, now, postMinutes, postRatio, expected }) => {
      expect(
        postFillMinutes(
          now,
          game,
          parkingWillFill,
          Object.assign({}, postBase, {
            parkingRatio: postRatio,
            parkingMinutes: postMinutes,
          })
        )
      ).toEqual(expected);
    });
  });
});

// --------------------------------------------------------

describe("predictPercent", () => {
  describe("予測なし", () => {
    test.each`
      label         | now                                | expected
      ${"予測なし"} | ${new Date("2021-11-28T11:15:00")} | ${0}
    `("$label", ({ label, now, expected }) => {
      expect(predictPercent(now, game.startAt, [])).toEqual(expected);
    });
  });

  describe("満車の予測データなし駐車場", () => {
    test.each`
      label                 | now                                | expected
      ${"予測地点最後以降"} | ${new Date("2021-11-28T15:00:00")} | ${90}
    `("$label", ({ label, now, expected }) => {
      expect(predictPercent(now, game.startAt, parkingWontFill.predictParkingStates)).toEqual(
        expected
      );
    });
  });

  describe("満車の予測データあり駐車場", () => {
    test.each`
      label                              | now                                | expected
      ${"予測地点以前"}                  | ${new Date("2021-11-28T07:00:00")} | ${0}
      ${"予測地点1つ目ちょうどピッタリ"} | ${new Date("2021-11-28T11:00:00")} | ${0}
      ${"予測地点2つ目ちょうどピッタリ"} | ${new Date("2021-11-28T11:05:00")} | ${50}
      ${"予測地点最後ちょうどピッタリ"}  | ${new Date("2021-11-28T11:30:00")} | ${100}
      ${"予測地点の中間地点"}            | ${new Date("2021-11-28T11:22:30")} | ${90}
      ${"予測地点最後以降"}              | ${new Date("2021-11-28T15:00:00")} | ${100}
    `("$label", ({ label, now, expected }) => {
      expect(predictPercent(now, game.startAt, parkingWillFill.predictParkingStates)).toEqual(
        expected
      );
    });
  });
});

// --------------------------------------------------------

describe("predictsFillMinutes", () => {
  describe("予測データなし", () => {
    test.each`
      label         | now                                | expected
      ${"予測なし"} | ${new Date("2021-11-28T11:15:00")} | ${0}
    `("$label", ({ label, now, expected }) => {
      expect(predictsFillMinutes(now, game, [])).toEqual(expected);
    });
  });

  describe("満車の予測データなし駐車場", () => {
    test.each`
      label         | now                                | expected
      ${"会場前"}   | ${new Date("2021-11-28T07:55:00")} | ${0}
      ${"会場直後"} | ${new Date("2021-11-28T08:00:00")} | ${0}
      ${"会場中"}   | ${new Date("2021-11-28T11:15:00")} | ${0}
      ${"閉場直後"} | ${new Date("2021-11-28T18:00:00")} | ${0}
    `("$label", ({ label, now, expected }) => {
      expect(predictsFillMinutes(now, game, parkingWontFill.predictParkingStates)).toEqual(
        expected
      );
    });
  });

  describe("満車の予測データあり駐車場", () => {
    test.each`
      label                   | now                                | expected
      ${"開場前"}             | ${new Date("2021-11-28T10:00:00")} | ${0}
      ${"開場直後"}           | ${new Date("2021-11-28T11:00:00")} | ${30}
      ${"満車時刻15分前"}     | ${new Date("2021-11-28T11:15:00")} | ${15}
      ${"満車時刻12分33秒前"} | ${new Date("2021-11-28T11:17:27")} | ${13}
      ${"満車時刻ちょうど）"} | ${new Date("2021-11-28T11:30:00")} | ${0}
      ${"満車時刻過ぎた後"}   | ${new Date("2021-11-28T12:30:00")} | ${0}
      ${"閉場直後"}           | ${new Date("2021-11-28T18:00:00")} | ${0}
    `("$label", ({ label, now, expected }) => {
      expect(predictsFillMinutes(now, game, parkingWillFill.predictParkingStates)).toEqual(
        expected
      );
    });
  });
});
