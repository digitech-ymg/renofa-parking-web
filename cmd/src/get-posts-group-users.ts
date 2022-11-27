import prompts from "prompts";
import { Parser } from "json2csv";
import { getPostsByDate } from "./firestore";
import { UserPostTime } from "../../src/types/User";

const today = new Date();

const questions: prompts.PromptObject[] = [
  {
    name: "beginning",
    message: "What date is the beginning of the period?",
    type: "date",
    initial: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    mask: "YYYY-MM-DD",
  },
  {
    name: "end",
    message: "What date is the end of the period?",
    type: "date",
    initial: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    mask: "YYYY-MM-DD",
  },
];

(async () => {
  try {
    const response = await prompts(questions);
    const beginning = response.beginning;
    const end = response.end;

    console.log("beginning: " + beginning);
    console.log("end: " + end);
    const posts = await getPostsByDate(beginning, end);

    // ニックネームと投稿回数のマップに置き換え
    const userPostTimes = new Array<UserPostTime>();
    posts.forEach((post) => {
      const nickname = post.nickname;
      console.log("nickname: " + nickname);
      // 新規ニックネームのみ集計したものを追加していく
      if (!userPostTimes.find((p) => p.nickname === nickname)) {
        console.log("in: " + nickname);
        userPostTimes.push({
          nickname,
          postTime: posts.filter((p) => p.nickname == nickname).length,
        });
      }
    });
    // ランキングですぐ使えるように多い順にソートしておきます
    userPostTimes.sort((a, b) => b.postTime - a.postTime);

    // JSON出力
    console.log(JSON.stringify(userPostTimes));
  } catch (err) {
    console.error("error: " + err);
  }
})();
