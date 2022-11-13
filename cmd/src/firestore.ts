import { initializeApp, applicationDefault } from "firebase-admin/app";
import { DocumentData, getFirestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
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

export const getPostsGroupByNickname = async (gameId: string) => {
  const queryRef = db
    .collection("posts")
    .where("gameId", "==", gameId)
    .orderBy("nickname", "desc")
    .orderBy("postedAt", "desc")
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

export const createGame = async (gameId: string, game: Game) => {
  return await db.collection("games").doc(gameId).set(game);
};

export const getAuthUsers = async () => {
  return await auth.listUsers(1000);
};

export const deleteAuthUsers = async (uids: string[]) => {
  return await auth.deleteUsers(uids);
};
