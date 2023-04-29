import type { Game } from "../types/Game";
import type { Post } from "../types/Post";
import {
  TITLE_ID_PERFECT,
  TITLE_ID_MORE_GAME_WIN,
  TITLE_ID_MORE_GAME_DRAW,
  TITLE_ID_MORE_GAME_LOSE,
  TITLE_ID_MORE_PARKING_PAID,
  TITLE_ID_MORE_PARKING_JA,
  TITLE_ID_MORE_PARKING_RIVERBED,
  TITLE_ID_MORE_PARKING_TRUCK,
  TITLE_ID_POST_ONCE,
  TITLE_ID_POST_NONE,
} from "../constants/user";

export const judgeUserTitle = (games: Game[] | null, posts: Post[] | null): number | null => {
  if (games == null || posts == null) {
    return null;
  }

  //投稿回数1回
  if (posts.length === 1) {
    return TITLE_ID_POST_ONCE;
  }

  //投稿回数0回
  if (posts.length === 0) {
    return TITLE_ID_POST_NONE;
  }

  //全ての試合で投稿した
  //同一シーズンの期間内で取得されたgamesとpostsという前提です
  if (games.length === posts.length) {
    return TITLE_ID_PERFECT;
  }

  //ホームゲーム半分以上に投稿している
  if (games.length / 2 <= posts.length) {
    const userGameIds = posts.map((post: Post) => post.gameId);

    const winTimes = games.filter((game: Game) => {
      return game.result === "win" && userGameIds.includes(game.id);
    }).length;

    const drawTimes = games.filter((game: Game) => {
      return game.result === "draw" && userGameIds.includes(game.id);
    }).length;

    const loseTimes = games.filter((game: Game) => {
      return game.result === "lose" && userGameIds.includes(game.id);
    }).length;

    //winが最も多い
    if (Math.max(winTimes, drawTimes, loseTimes) === winTimes) {
      return TITLE_ID_MORE_GAME_WIN;
    }
    //drawが最も多い
    if (Math.max(winTimes, drawTimes, loseTimes) === drawTimes) {
      return TITLE_ID_MORE_GAME_DRAW;
    }
    //loseが最も多い
    if (Math.max(winTimes, drawTimes, loseTimes) === loseTimes) {
      return TITLE_ID_MORE_GAME_LOSE;
    }
  }

  //ホームゲーム半分未満投稿
  else {
    //それぞれの駐車場に駐めた回数
    const paidTimes = posts.filter((post: Post) => post.parkingId === "paid").length;
    const jaTimes = posts.filter((post: Post) => post.parkingId === "ja").length;
    const riverbedTimes = posts.filter((post: Post) => post.parkingId === "riverbed").length;
    const truckTimes = posts.filter((post: Post) => post.parkingId === "truck").length;

    //paidが最も多い
    if (Math.max(paidTimes, jaTimes, riverbedTimes, truckTimes) === paidTimes) {
      return TITLE_ID_MORE_PARKING_PAID;
    }
    //jaが〃
    if (Math.max(paidTimes, jaTimes, riverbedTimes, truckTimes) === jaTimes) {
      return TITLE_ID_MORE_PARKING_JA;
    }
    //riverbedが〃
    if (Math.max(paidTimes, jaTimes, riverbedTimes, truckTimes) === riverbedTimes) {
      return TITLE_ID_MORE_PARKING_RIVERBED;
    }
    //truckが〃
    if (Math.max(paidTimes, jaTimes, riverbedTimes, truckTimes) === truckTimes) {
      return TITLE_ID_MORE_PARKING_TRUCK;
    }
  }

  return null;
};

export const getUserTitleText = (titleId: number): string[] => {
  switch (titleId) {
    case TITLE_ID_PERFECT:
      return ["超絶コアサポーター", "すべてホームゲームで投稿してくれた方"];
    case TITLE_ID_MORE_GAME_WIN:
      return ["ありがとう勝ち運サポーター", "観戦した中でレノファの勝ち数が多い方"];
    case TITLE_ID_MORE_GAME_DRAW:
      return ["負けない事が大事サポーター", "観戦した中でレノファの引き分け数が多い方"];
    case TITLE_ID_MORE_GAME_LOSE:
      return ["涙の数だけ強くなるサポーター", "観戦した中でレノファの負け数が多い方"];
    case TITLE_ID_MORE_PARKING_PAID:
      return ["有料優良サポーター", "気前よく有料駐車場によく停める方"];
    case TITLE_ID_MORE_PARKING_JA:
      return ["近いところが好きサポーター", "JAによく停める方"];
    case TITLE_ID_MORE_PARKING_RIVERBED:
      return ["橋を渡ってくるサポーター", "河川敷によく停める方"];
    case TITLE_ID_MORE_PARKING_TRUCK:
      return ["トラック協会ありがとうサポーター", "トラック協会によく停める方"];
    case TITLE_ID_POST_ONCE:
      return ["駐車場協力始めましたサポーター", "投稿数が1件の方"];
    case TITLE_ID_POST_NONE:
      return ["期待の新人サポーター", "投稿数が0件の方"];
  }

  return ["", ""];
};
