import type { Post } from "../../src/types/Post";
import type { Game } from "../../src/types/Game";
import type { User } from "../../src/types/User";
// import { Parser } from "json2csv";
import { updateUser } from "../../src/lib/firestore";
import { getAllPosts, getGame } from "./firestore";
import { judgeUserTitle } from "../../src/utils/user";
import { titles } from "../../src/constants/titles";
import { titleDescriptions } from "../../src/constants/titleDescriptions";

//誰も投稿していないとゲームが存在しないことになる？
(async function () {
  const allPosts: Post[] = await getAllPosts();

  const usersPosts: any = {};
  const allGames = await getAllGamesByAllPosts(allPosts);

  allPosts.forEach((post) => {
    const nickname = post.nickname;
    if (Object.keys(usersPosts).includes(nickname)) {
      return;
    }

    usersPosts[nickname] = getUserPostsByNickname(allPosts, nickname);
  });

  for (let i = 0; i < usersPosts.length; i++) {
    const nickname = usersPosts[i][0].nickname;
    const titleId: any = judgeUserTitle(allGames, usersPosts[i]);
    const title: string = titles[titleId];
    const titleDescription: string = titleDescriptions[titleId];
    const postTimes = usersPosts[i].length;

    //既存のuserが取得できていない
    const user = {
      // id: string,
      // photoURL: string,
      // createdAt: Date,
      nickname: nickname,
      title: title,
      titleDescription: titleDescription,
      postTimes: postTimes,
    };

    updateUser(user);
  }
})();

function getUserPostsByNickname(allPosts: Post[], nickname: string): Post[] {
  return allPosts.filter((post) => {
    return post.nickname === nickname;
  });
}

async function getAllGamesByAllPosts(allPosts: Post[]) {
  const gameIds: string[] = [];

  allPosts.forEach((post) => {
    if (gameIds.includes(post.gameId)) {
      return;
    }
    gameIds.push(post.gameId);
  });

  const allGames = [];

  for (let i = 0; i < gameIds.length; i++) {
    allGames.push(await getGame(gameIds[i]));
  }

  return allGames;
}
