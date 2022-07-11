import { Parser } from "json2csv";
import { getAllPosts } from "./firestore";

(async () => {
  try {
    const posts = await getAllPosts();

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
