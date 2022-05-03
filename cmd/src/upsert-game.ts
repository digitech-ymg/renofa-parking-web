import prompts from "prompts";
import { createGame } from "./firestore";
import { Game } from "../../src/types/Game";

const today = new Date();

const questions: prompts.PromptObject[] = [
  {
    name: "date",
    message: "What date is the game?",
    type: "date",
    initial: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    mask: "YYYY-MM-DD",
  },
  {
    name: "kind",
    message: "What kind is the game?",
    type: "text",
    initial: "明治安田生命J2リーグ",
  },
  {
    name: "section",
    message: "What section is the game?",
    type: "text",
    initial: "第1節",
  },
  {
    name: "opponent",
    message: "What is the opponent team name?",
    type: "text",
    initial: "サンフレッチェ広島",
  },
  {
    name: "startAt",
    message: "When does the game start at?",
    type: "date",
    initial: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
    mask: "HH:mm",
  },
  {
    name: "finishAt",
    message: "When does the game finish at?",
    type: "date",
    initial: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
    mask: "HH:mm",
  },
  {
    name: "availableParkings",
    type: "multiselect",
    message: "Which parking is available?",
    choices: [
      { title: "有料駐車場", value: "paid", selected: true },
      { title: "JA山口", value: "ja", selected: true },
      { title: "トラック協会", value: "truck", selected: true },
      { title: "河川敷", value: "riverbed", selected: true },
      { title: "パナソニック", value: "panasonic" },
    ],
  },
];

(async () => {
  const response = await prompts(questions);

  // 最後の質問が無ければ途中キャンセル
  if (!response.availableParkings) {
    console.log("canceled");
    return;
  }

  console.dir(response);

  const year = response.date.getFullYear();
  const month = (response.date.getMonth() + 1).toString().padStart("2", "0");
  const date = response.date.getDate().toString().padStart("2", "0");
  const gameId = `${year}${month}${date}`;

  const game: Game = {
    id: gameId,
    kind: response.kind,
    section: response.section,
    startAt: response.startAt,
    finishAt: response.finishAt,
    opponent: response.opponent,
    availableParkings: response.availableParkings,
  };
  createGame(gameId, game)
    .then((res) => {
      console.log("succeeded");
    })
    .catch((e) => {
      console.log("failed: " + e);
    });
})();
