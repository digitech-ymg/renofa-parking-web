// import { getPosts } from "firestore";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { Parser } from "json2csv";

const serviceAccount = require("../renofa-parking.json");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();
const getPosts = async (gameId) => {
  const ref = db.collection("posts");

  const queryRef = ref.where("gameId", "==", gameId).get();
};

(async () => {
  try {
    const querySnapshot = await db
      .collection("posts")
      .where("gameId", "==", "20220417")
      .orderBy("postedAt", "desc")
      .get();

    const jsons = querySnapshot.docs.map((doc) => {
      // return doc.data();
      const obj = doc.data();
      const postedAt = obj.postedAt.toDate();
      const parkedAt = new Date(2022, 3, 17, 14, postedAt.getMinutes(), postedAt.getSeconds());
      parkedAt.setMinutes(parkedAt.getMinutes() + obj.parkingMinutes);
      return {
        gameId: obj.gameId,
        nickname: obj.nickname,
        parkingId: obj.parkingId,
        parkingMinutes: obj.parkingMinutes,
        parkingRatio: obj.parkingRatio,
        postedAt: obj.postedAt.toDate(),
        // postedAt: postedAt,
        // parkedAt: parkedAt,
      };
    });
    // console.dir(jsons);

    // CSV のヘッダーを定義( label = ヘッダー項目、value = JSON のキー名)
    const fields = [
      { label: "gameId", value: "gameId" },
      { label: "nickname", value: "nickname" },
      { label: "parkingId", value: "parkingId" },
      { label: "parkingMinutes", value: "parkingMinutes" },
      { label: "parkingRatio", value: "parkingRatio" },
      { label: "postedAt", value: "postedAt" },
      // { label: "parkedAt", value: "parkedAt" },
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(jsons);
    console.log(csv);
  } catch (err) {
    // console.log(`Error: ${JSON.stringify(err)}`);
    console.log(`Error: ${err}`);
  }
})();
