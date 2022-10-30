import prompts from "prompts";
import { Parser } from "json2csv";
import { getPostsGroupByNickname } from "./firestore";

const beginning = new Date();
const end = new Date();

const questions: prompts.PromptObject[] = [
  {
    name: "beginning",
    message: "What date is the beginning of the period?",
    type: "date",
    initial: new Date(beginning.getFullYear(), beginning.getMonth(), beginning.getDate()),
    mask: "YYYY-MM-DD",
  },
  {
    name: "end",
    message: "What date is the end of the period?",
    type: "date",
    initial: new Date(end.getFullYear(), end.getMonth(), end.getDate()),
    mask: "YYYY-MM-DD",
  },
  {
    name: "nickname",
    message: "Who's data you want?",
    type: "text",
    initial: "nickname",
  },
];

(async () => {
  try {
    const response = await prompts(questions);
    const nickname = response.nickname;
    const posts = await getPostsGroupByNickname(nickname);

    // CSV のヘッダーを定義( label = ヘッダー項目、value = JSON のキー名)
    const fields = [
      { label: "gameId", value: "gameId" },
      { label: "nickname", value: "nickname" },
      { label: "parkingId", value: "parkingId" },
      { label: "parkingMinutes", value: "parkingMinutes" },
      { label: "parkingRatio", value: "parkingRatio" },
      { label: "parkedAgo", value: "parkedAgo" },
      { label: "parkedAt", value: "parkedAt" },
      { label: "postedAt", value: "postedAt" },
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(posts);
    console.log(csv);
  } catch (err) {
    console.error("error: " + err);
  }
})();
