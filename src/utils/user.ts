import type { Game } from "@/types/Game";
import type { Post } from "@/types/Post";

export const judgeUserTitle = (games: Game[], user_posts: Post[]): number => {
  //投稿回数1回
  if (user_posts.length === 1) {
    return 11;
  }

  //投稿回数0回
  if (user_posts.length === 0) {
    return 12;
  }

  //全ての試合で投稿した
  if (games.every((game) => isPostedInGame(game, user_posts))) {
    return 3;
  }

  //ホームゲーム半分以上に投稿している
  if (games.length / 2 <= user_posts.length) {
    let win_times = 0;
    let draw_times = 0;
    let lose_times = 0;

    user_posts.forEach((post) => {
      const game = getGameByPost(games, post);

      switch (game.result) {
        case "win":
          win_times++;
          break;
        case "draw":
          draw_times++;
          break;
        case "lose":
          lose_times++;
          break;

        default:
          console.error("game result: ", game.result, " is not defined");
          break;
      }
    });

    //winが最も多い
    if (Math.max(win_times, draw_times, lose_times) === win_times) {
      return 4;
    }
    //drawが最も多い
    if (Math.max(win_times, draw_times, lose_times) === draw_times) {
      return 5;
    }
    //loseが最も多い
    if (Math.max(win_times, draw_times, lose_times) === lose_times) {
      return 6;
    }
  }

  //ホームゲーム半分未満投稿
  else {
    //それぞれの駐車場に駐めた回数
    let paid_times = 0;
    let ja_times = 0;
    let riverbed_times = 0;
    let truck_times = 0;

    user_posts.forEach((post) => {
      switch (post.parkingId) {
        case "paid":
          paid_times++;
          break;
        case "ja":
          ja_times++;
          break;
        case "riverbed":
          riverbed_times++;
          break;
        case "truck":
          truck_times++;
          break;

        default:
          console.error("parkingId: ", post.parkingId, " is not defined");
          break;
      }
    });

    //paidが最も多い
    if (Math.max(paid_times, ja_times, riverbed_times, truck_times) === paid_times) {
      return 7;
    }
    //jaが〃
    if (Math.max(paid_times, ja_times, riverbed_times, truck_times) === ja_times) {
      return 8;
    }
    //riverbedが〃
    if (Math.max(paid_times, ja_times, riverbed_times, truck_times) === riverbed_times) {
      return 9;
    }
    //truckが〃
    if (Math.max(paid_times, ja_times, riverbed_times, truck_times) === truck_times) {
      return 10;
    }
  }

  return NaN; //TODO: デフォルトのreturn は何？
};

function getGameByPost(games: Game[], post: Post) {
  for (let i = 0; i < games.length; i++) {
    if (games[i].id === post.gameId) {
      return games[i];
    }
  }

  return {
    result: "",
  };
}

//そのゲームでユーザーが投稿しているか
function isPostedInGame(game: Game, user_posts: Post[]): Boolean {
  for (let i = 0; i < user_posts.length; i++) {
    if (game.id === user_posts[i].gameId) {
      return true;
    }
  }

  return false;
}
