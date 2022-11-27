import prompts from "prompts";
import { Parser } from "json2csv";
import { getPostsByDate } from "./firestore";

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

    // CSV のヘッダーを定義( label = ヘッダー項目、value = JSON のキー名)
    const fields = [
      { label: "gameId", value: "gameId" },
      { label: "nickname", value: "nickname" },
      { label: "parkingId", value: "parkingId" },
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
