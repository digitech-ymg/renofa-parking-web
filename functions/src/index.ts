import * as functions from "firebase-functions";

import { User } from "./types/User";
import { Game } from "./types/Game";
import { Post } from "./types/Post";

import { getTodayGame, getUsers, getGamesByDate, getPostsByDate, updateUser } from "./firestore";
import { judgeUserTitle, getUserTitleText } from "./utils/user";

process.env.TZ = "Asia/Tokyo";

export const updateUserTitle = functions.pubsub
  .schedule("0 21 * * *")
  .timeZone("Asia/Tokyo")
  .onRun((context) => {
    functions.logger.info("updateUserTitle triggered.");
    return exec();
  });

const exec = async (): Promise<any> => {
  try {
    // 今日試合があって21時にバッチ起動して更新するタイミング
    const game = await getTodayGame();
    // 2月1日が年間を通してリセットするタイミング
    // シーズン前半の日程が登録されている＆全ユーザーの投稿数が0件なので、全ユーザーが初期状態に更新される
    const now = new Date();
    const isResetDay = now.getMonth() === 1 && now.getDate() === 1;

    if (game || isResetDay) {
      functions.logger.info("today has game or reset day:");

      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = new Date(now.getFullYear() + 1, 0, 1);
      functions.logger.info(`from: ${from.toLocaleDateString()}`);
      functions.logger.info(`to  : ${to.toLocaleDateString()}`);
      const users: User[] = await getUsers();
      const games: Game[] = await getGamesByDate(from, to);
      const posts: Post[] = await getPostsByDate(from, to);
      functions.logger.info(`users: ${users ? users.length : "nil"}`);
      functions.logger.info(`games: ${games ? games.length : "nil"}`);
      functions.logger.info(`posts: ${posts ? posts.length : "nil"}`);

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
      functions.logger.info(`updateUserTitle finished.`);
      return Promise.resolve("updateUserTitle finished.");
    } else {
      functions.logger.info(`today no game`);
      return Promise.resolve("today no game");
    }
  } catch (err) {
    functions.logger.error("error: " + err);
    return Promise.reject("error: " + err);
  }
};
