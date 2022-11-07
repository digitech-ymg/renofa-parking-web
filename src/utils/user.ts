import type { Game } from "@/types/Game";
import type { Post } from "@/types/Post";
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
} from "@/constants/user";

export const judgeUserTitle = (games: Game[], posts: Post[]): number => {
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
    const userGameIds = posts.map((post) => post.gameId);

    const winTimes = games.filter((game) => {
      return game.result === "win" && userGameIds.includes(game.id);
    }).length;

    const drawTimes = games.filter((game) => {
      return game.result === "draw" && userGameIds.includes(game.id);
    }).length;

    const loseTimes = games.filter((game) => {
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
    const paidTimes = posts.filter((post) => post.parkingId === "paid").length;
    const jaTimes = posts.filter((post) => post.parkingId === "ja").length;
    const riverbedTimes = posts.filter((post) => post.parkingId === "riverbed").length;
    const truckTimes = posts.filter((post) => post.parkingId === "truck").length;

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

  return NaN; //TODO: デフォルトのreturn は何？
};
