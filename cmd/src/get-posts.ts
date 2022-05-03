import { Parser } from "json2csv";
import { getPosts } from "./firestore";

(async () => {
  try {
    if (process.argv.length < 3) {
      throw "require gameId: ts-node src/get-posts.ts 20220428";
    }
    const gameId = process.argv[2];
    const posts = await getPosts(gameId);

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
