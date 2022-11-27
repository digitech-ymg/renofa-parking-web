import { initializeApp, applicationDefault } from "firebase-admin/app";
import {
  DocumentData,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Game } from "../../src/types/Game";
import { Post } from "../../src/types/Post";

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();
const auth = getAuth();

export const getAllPosts = async () => {
  const queryRef = db
    .collection("posts")
    .orderBy("postedAt", "desc")
    .withConverter<Post>(postConverter);

  const querySnapshot = await queryRef.get();
  const posts = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data();
  });

  return posts;
};

export const getPostsByDate = async (beggining: Date, end: Date) => {
  const queryRef = db
    .collection("posts")
    .where("postedAt", ">=", beggining)
    .where("postedAt", "<", end)
    .withConverter<Post>(postConverter);

  const querySnapshot = await queryRef.get();
  const posts = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data();
  });

  return posts;
};

export const getPostsByGameId = async (gameId: string) => {
  const queryRef = db
    .collection("posts")
    .where("gameId", "==", gameId)
    .orderBy("postedAt", "desc")
    .withConverter<Post>(postConverter);

  const querySnapshot = await queryRef.get();
  const posts = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data();
  });

  return posts;
};

const postConverter = {
  toFirestore(post: Post): DocumentData {
    return {
      nickname: post.nickname,
      gameId: post.gameId,
      parkingId: post.parkingId,
      parkingRatio: post.parkingRatio,
      parkingMinutes: post.parkingMinutes,
      parkedAgo: post.parkedAgo,
      parkedAt: post.parkedAt,
      postedAt: post.postedAt,
      userId: post.userId,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Post {
    const data = snapshot.data()!;
    return {
      nickname: data.nickname,
      gameId: data.gameId,
      parkingId: data.parkingId,
      parkingRatio: data.parkingRatio,
      parkingMinutes: data.parkingMinutes,
      parkedAgo: data.parkedAgo,
      parkedAt: data.parkedAt.toDate(),
      postedAt: data.postedAt.toDate(),
      userId: data.userId,
    };
  },
};

export const updateGame = async (gameId: string, game: Game) => {
  return await db.collection("games").doc(gameId).set(game);
};

export const getGame = async (gameId: string): Promise<Game | null | undefined> => {
  const docRef = db.collection("games").doc(gameId).withConverter(gameConverter);
  const docSnap = await docRef.get();
  return docSnap.exists ? docSnap.data() : null;
};

const gameConverter = {
  toFirestore(game: Game): DocumentData {
    return {
      id: game.id,
      kind: game.kind,
      section: game.section,
      startAt: Timestamp.fromDate(game.startAt),
      finishAt: Timestamp.fromDate(game.finishAt),
      availableParkings: game.availableParkings,
      soldOutParkings: game.soldOutParkings,
      opponent: game.opponent,
      attendance: game.attendance,
      result: game.result,
      goalScore: game.goalScore,
      goalAgainst: game.goalAgainst,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Game {
    const data = snapshot.data()!;
    return {
      id: data.id,
      kind: data.kind,
      section: data.section,
      startAt: data.startAt.toDate(),
      finishAt: data.finishAt.toDate(),
      availableParkings: data.availableParkings,
      soldOutParkings: data.soldOutParkings,
      opponent: data.opponent,
      attendance: data.attendance,
      result: data.result,
      goalScore: data.goalScore,
      goalAgainst: data.goalAgainst,
    };
  },
};

export const getAuthUsers = async () => {
  return await auth.listUsers(1000);
};

export const deleteAuthUsers = async (uids: string[]) => {
  return await auth.deleteUsers(uids);
};
