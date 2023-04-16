import type { User } from "../../src/types/User";
import { getUserTitleText, judgeUserTitle } from "../../src/utils/user";
import { getGamesByDate, getPostsByDate, getUsers, updateUser } from "./firestore";
import { Game } from "../../src/types/Game";
import { Post } from "../../src/types/Post";

// 　手順整理
// 　１．期間指定して、試合データと投稿データを取ってきます。（2023シーズンを指定）
// 　２．2つデータから、ユーザーごとの称号を関数を通して決定。（既存開発済み）
// 　３．そのユーザー全員をデータを新しい称号で更新しにいく。

// 今年の1月から12月の試合や投稿を対象範囲とする
const now = new Date();
const beggining = new Date(`${now.getFullYear()}/1/1`);
const end = new Date(`${now.getFullYear() + 1}/1/1`);
console.log(`query target: beggining: ${beggining.toLocaleString()}, end: ${end.toLocaleString()}`);

(async () => {
  try {
    const users: User[] = await getUsers();
    const games: Game[] = await getGamesByDate(beggining, end);
    const posts: Post[] = await getPostsByDate(beggining, end);

    users.forEach(async (user: User) => {
      const userPosts = posts.filter((post) => post.userId === user.id);
      const titleId = judgeUserTitle(games, userPosts);
      if (titleId == null) {
        // 不明なユーザーは飛ばして次にいく
        return;
      }

      const [title, titleDescription] = getUserTitleText(titleId);
      const newUser: User = {
        id: user.id,
        nickname: user.nickname,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        title: title,
        titleDescription: titleDescription,
        postTimes: userPosts.length,
      };

      console.log(
        `user[${user.id},${user.nickname}]: title->${title}, description->${titleDescription}, postTimes->${userPosts.length}}`
      );
      updateUser(newUser.id, newUser);
    });
  } catch (err) {
    console.error("error: " + err);
  }
})();
