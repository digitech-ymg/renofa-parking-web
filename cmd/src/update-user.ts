import type { User } from "../../src/types/User";
import { judgeUserTitle } from "../../src/utils/user";
import { updateUser } from "../../src/lib/firestore";
import { getAuthUsers, getGamesByDate, getPostsByDate } from "./firestore";
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
} from "../../src/constants/user";

// 　手順整理
// 　１．期間指定して、試合データと投稿データを取ってきます。（2023シーズンを指定）
// 　２．2つデータから、ユーザーごとの称号を関数を通して決定。（既存開発済み）
// 　３．そのユーザー全員をデータを新しい称号で更新しにいく。

const beggining = new Date("2023/1/1"); //new Date(process.argv[2])
const end = new Date("2023/12/31"); //new Date(process.argv[3])

(async () => {
  try {
    const users = (await getAuthUsers()).users;
    const games = await getGamesByDate(beggining, end);
    const posts = await getPostsByDate(beggining, end);

    // console.log("users: ", users);
    // console.log("games: ", games);
    // console.log("posts: ", posts);

    users.forEach(async (user: any) => {
      const userPosts = posts.map((post) => post.userId == user.id);
      const titleNum = judgeUserTitle(games, userPosts);
      let title, titleDescription: string;

      switch (titleNum) {
        case TITLE_ID_PERFECT:
          title = "超絶コアサポーター";
          titleDescription = "すべてホームゲームで投稿してくれた方";
          break;
        case TITLE_ID_MORE_GAME_WIN:
          title = "ありがとう勝ち運サポーター";
          titleDescription = "観戦した中でレノファの勝ち数が多い方";
          break;
        case TITLE_ID_MORE_GAME_DRAW:
          title = "負けない事が大事サポーター";
          titleDescription = "観戦した中でレノファの引き分け数が多い方";
          break;
        case TITLE_ID_MORE_GAME_LOSE:
          title = "涙の数だけ強くなるサポーター";
          titleDescription = "観戦した中でレノファの負け数が多い方";
          break;
        case TITLE_ID_MORE_PARKING_PAID:
          title = "有料優良サポーター";
          titleDescription = "気前よく有料駐車場によく停める方";
          break;
        case TITLE_ID_MORE_PARKING_JA:
          title = "近いところが好きサポーター";
          titleDescription = "JAによく停める方";
          break;
        case TITLE_ID_MORE_PARKING_RIVERBED:
          title = "橋を渡ってくるサポーター";
          titleDescription = "河川敷によく停める方";
          break;
        case TITLE_ID_MORE_PARKING_TRUCK:
          title = "トラック協会ありがとうサポーター";
          titleDescription = "トラック協会によく停める方";
          break;
        case TITLE_ID_POST_ONCE:
          title = "駐車場協力始めましたサポーター";
          titleDescription = "投稿数が1件の方";
          break;
        case TITLE_ID_POST_NONE:
          title = "期待の新人サポーター";
          titleDescription = "投稿数が0件の方";
          break;
        default:
          title = "";
          titleDescription = "";
          break;
      }

      const newUser: User = {
        id: user.id,
        nickname: user.nickname,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        title: title,
        titleDescription: titleDescription,
        postTimes: userPosts.length,
      };

      // console.log("newUser: ", newUser);
      updateUser(newUser).then(() => {
        console.log("updated user");
      });
    });
  } catch (err) {
    console.error("error: " + err);
  }
})();
