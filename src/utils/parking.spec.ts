import type { Game } from "@/types/Game";
import type { Parking } from "@/types/Parking";
import { Post } from "@/types/Post";
import { parkingStatus, selectPostForCalc, predictsFillDate } from "./parking";

const game: Game = {
  id: "20211128",
  kind: "明治安田生命J2リーグ",
  section: "第1節",
  partner: "",
  thanksday: "",
  startAt: new Date("2021-11-28T14:00:00"),
  finishAt: new Date("2021-11-28T16:00:00"),
  opponent: "ロアッソ熊本",
  availableParkings: ["paid", "ja", "truck", "riverbed"],
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
  predicts: [
    { minutes: -180, ratio: 0.0 },
    { minutes: -165, ratio: 0.5 },
    { minutes: -150, ratio: 1.0 },
  ],
  minutesToPark: -180,
  slopeToPark: 0.0333,
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
  predicts: [
    { minutes: -150, ratio: 0.0 },
    { minutes: 0, ratio: 0.75 },
  ],
  minutesToPark: -150,
  slopeToPark: 0.005,
  images: ["/img/parking-truck1.jpg", "/img/parking-truck2.jpg"],
};

const emptyPosts: Post[] = [];
// 投稿はparkingWontFillの採用関数（＝増加関数の2倍）に対して、下回ればvalid、上回ればinvalidとしています。
const postBase = {
  nickname: "hoge",
  gameId: "20211128",
  parkingId: "truck",
};

describe("parkingStatus（満車になる駐車場/投稿なし）", () => {
  it("開場の前日", () => {
    expect(
      parkingStatus(new Date("2021-11-27T00:00:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "beforeOpen",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("開場の直前", () => {
    expect(
      parkingStatus(new Date("2021-11-28T07:59:59"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "beforeOpen",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("開場の直後", () => {
    expect(
      parkingStatus(new Date("2021-11-28T11:00:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 0,
      fillMinutes: 30,
    });
  });

  it("予測地点ピッタリ", () => {
    expect(
      parkingStatus(new Date("2021-11-28T11:15:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 50,
      fillMinutes: 15,
    });
  });

  it("予測地点の中間", () => {
    expect(
      parkingStatus(new Date("2021-11-28T11:22:30"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 75,
      fillMinutes: 8,
    });
  });

  it("満車予測地点の直前", () => {
    expect(
      parkingStatus(new Date("2021-11-28T11:29:59"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 99,
      fillMinutes: 1,
    });
  });

  it("満車予測地点ぴったり", () => {
    expect(
      parkingStatus(new Date("2021-11-28T11:30:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "filled",
      percent: 100,
      fillMinutes: 0,
    });
  });

  it("満車予測地点以降", () => {
    expect(
      parkingStatus(new Date("2021-11-28T13:00:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "filled",
      percent: 100,
      fillMinutes: 0,
    });
  });

  it("閉場の直後", () => {
    expect(
      parkingStatus(new Date("2021-11-28T18:00:00"), game, parkingWillFill, emptyPosts)
    ).toMatchObject({
      state: "afterClosed",
      percent: 0,
      fillMinutes: 0,
    });
  });

  it("使用できない（予測情報などがあって開場時間中でも無視）", () => {
    const parkingDisable = Object.assign(parkingWillFill, { id: "panasonic" });
    expect(
      parkingStatus(new Date("2021-11-28T12:00:00"), game, parkingDisable, emptyPosts)
    ).toMatchObject({
      state: "disable",
      percent: 0,
      fillMinutes: 0,
    });
  });
});

describe("parkingStatus（満車にならない駐車場/投稿なし）", () => {
  it("最後の予測点時間ぴったり", () => {
    expect(
      parkingStatus(new Date("2021-11-28T14:00:00"), game, parkingWontFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 75,
    });
  });

  it("最後の予測点時間以降", () => {
    expect(
      parkingStatus(new Date("2021-11-28T15:00:00"), game, parkingWontFill, emptyPosts)
    ).toMatchObject({
      state: "opened",
      percent: 75,
      fillMinutes: 0,
    });
  });
});

describe("parkingStatus（満車にならない駐車場/投稿あり）", () => {
  it("有効投稿10%（採用されず予測データのまま）", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, {
        parkingRatio: 0.1,
        parkingMinutes: -140,
      }),
    ];
    expect(
      // 135分前、予測データは15%（採用）、投稿データは20%（非採用）
      parkingStatus(new Date("2021-11-28T12:00:00"), game, parkingWontFill, posts)
    ).toMatchObject({
      state: "opened",
      percent: 15,
    });
  });

  // it("有効投稿50%その時間", () => {
  //   const posts: Post[] = [
  //     Object.assign({}, postBase, {
  //       parkingRatio: 0.5,
  //       parkingMinutes: -60,
  //     }),
  //   ];
  //   expect(
  //     // 60分前、予測データは44%（非採用）、投稿データは50%（採用）
  //     parkingStatus(new Date("2021-11-28T13:00:00"), game, parkingWontFill, posts)
  //   ).toMatchObject({
  //     state: "opened",
  //     percent: 50,
  //   });
  // });

  // it("最後の予測点時間以降", () => {
  //   expect(
  //     parkingStatus(new Date("2021-11-28T15:00:00"), game, parkingWontFill, emptyPosts)
  //   ).toMatchObject({
  //     state: "opened",
  //     percent: 75,
  //     fillMinutes: 0,
  //   });
  // });
});

describe("selectPostForCalc", () => {
  it("投稿なし", () => {
    expect(selectPostForCalc(game, parkingWontFill, [])).toEqual(null);
  });

  it("駐車開始点以前", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -300 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.1(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -100 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.5(不正)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -120 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toEqual(null);
  });

  it("[0.5(不正), 0.5(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -120 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })
    );
  });

  it("[0.5(採用)]", () => {
    const posts: Post[] = [Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })
    );
  });

  it("[0,1(不採用), 0.5(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -100 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })
    );
  });

  it("[0,1(不採用), 0.5(採用), 0.5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.1, parkingMinutes: -100 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -60 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })
    );
  });

  it("[0,5(採用), 0.5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -65 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 })
    );
  });

  it("[0,5(不採用), 0.8(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 })
    );
  });

  it("[0,5(不採用), 0.8(採用), 0,5(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -35 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 })
    );
  });

  it("[0,5(不採用), 0.8(採用), 0.8(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -30 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 })
    );
  });

  it("[0,5(不採用), 0.8(不採用), 1.0(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -20 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -20 })
    );
  });

  it("[0,5(不採用), 0.8(不採用), 1.0(採用), 1.0(不採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -20 }),
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -15 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -20 })
    );
  });

  it("[1.0(不正), 0,5(不採用), 0.8(採用)]", () => {
    const posts: Post[] = [
      Object.assign({}, postBase, { parkingRatio: 1.0, parkingMinutes: -80 }),
      Object.assign({}, postBase, { parkingRatio: 0.5, parkingMinutes: -75 }),
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 }),
    ];
    expect(selectPostForCalc(game, parkingWontFill, posts)).toMatchObject(
      Object.assign({}, postBase, { parkingRatio: 0.8, parkingMinutes: -40 })
    );
  });
});

describe("predictsFillDate", () => {
  it("満車時刻あり", () => {
    expect(predictsFillDate(game, parkingWillFill.predicts)).toEqual(
      new Date("2021-11-28T11:30:00")
    );
  });

  it("満車時刻なし", () => {
    expect(predictsFillDate(game, parkingWontFill.predicts)).toBeNull();
  });

  it("予測なし", () => {
    const parkingNoPredicts = Object.assign(parkingWillFill, { predicts: [] });
    expect(predictsFillDate(game, [])).toBeNull();
  });
});
