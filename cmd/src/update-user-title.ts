import type { Post } from "../../src/types/Post";
import type { Game } from "../../src/types/Game";
import type { User } from "../../src/types/User";
// import { Parser } from "json2csv";
import { updateUser } from "../../src/lib/firestore";
import { getAllPosts, getGame, getAuthUsers } from "./firestore";
import { judgeUserTitle } from "../../src/utils/user";
import { titles } from "../../src/constants/titles";
import { titleDescriptions } from "../../src/constants/titleDescriptions";

//誰も投稿していないとゲームが存在しないことになる？
(async function () {
  const allPosts: Post[] = await getAllPosts();
  const authUsers = await getAuthUsers();

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

    const user = getUserByNickname(authUsers, nickname);
    user.nickname = nickname;
    user.title = title;
    user.titleDescription = titleDescription;
    user.postTimes = postTimes;

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

function getUserByNickname(users: User[], nickname: string): any {
  for (let i = 0; i < users.length; i++) {
    if (users[i].nickname === nickname) {
      return users[i];
    }
  }
}
