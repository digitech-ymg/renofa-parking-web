import prompts from "prompts";
import { updateGame, getGame } from "./firestore";
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
    name: "attendance",
    message: "How many attendance?",
    type: "number",
    initial: 0,
  },
  {
    name: "result",
    message: "What is result?",
    type: "select",
    choices: [
      { title: "win", value: "win" },
      { title: "draw", value: "draw" },
      { title: "lose", value: "lose" },
    ],
    initial: 1,
  },
  {
    name: "goalScore",
    message: "How goalScore",
    type: "number",
    initial: 0,
  },
  {
    name: "goalAgainst",
    message: "How goalAgainst?",
    type: "number",
    initial: 0,
  },
];

(async () => {
  const response = await prompts(questions);

  const date = response.date;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart("2", "0");
  const day = date.getDate().toString().padStart("2", "0");
  const gameId = `${year}${month}${day}`;
  console.log("gameId: " + gameId);
  const game = await getGame(gameId);
  if (!game) {
    console.log("game not found");
    return;
  }

  game.attendance = response.attendance;
  game.result = response.result;
  game.goalScore = response.goalScore;
  game.goalAgainst = response.goalAgainst;

  updateGame(gameId, game)
    .then((res) => {
      console.log("succeeded");
    })
    .catch((e) => {
      console.log("failed: " + e);
    });
})();
