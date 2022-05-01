import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

const serviceAccount = require("../renofa-parking.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export const getPosts = async (gameId) => {
  const ref = db.collection("posts");

  const queryRef = ref.where("gameId", "==", gameId);
  return queryRef.json();
};
