import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { Game } from "./types/Game";
import { User } from "./types/User";
import { Post } from "./types/Post";

admin.initializeApp();
const db = admin.firestore(functions.config().firebase);

export const getTodayGame = async (): Promise<Game | null> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  tomorrow.setDate(tomorrow.getDate() + 1);
  functions.logger.info(`today: ${today}`);
  functions.logger.info(`tomorrow: ${tomorrow}`);

  var gamesRef = db
    .collection("games")
    .where("startAt", ">=", today)
    .where("startAt", "<", tomorrow)
    .withConverter<Game>(gameConverter);

  return gamesRef.get().then((snapshot) => {
    const games: Game[] = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      return doc.data() as Game;
    });
    if (games.length > 0) {
      return games[0];
    } else {
      return null;
    }
  });
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

export const getUsers = async (): Promise<User[]> => {
  const queryRef = db.collection("users").withConverter(userConverter);

  const querySnapshot = await queryRef.get();
  const users = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data() as User;
  });

  return users;
};

export const updateUser = async (userId: string, user: User) => {
  return await db.collection("users").doc(userId).set(user);
};

const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      id: user.id,
      nickname: user.nickname,
      photoURL: user.photoURL,
      createdAt: Timestamp.fromDate(user.createdAt),
      title: user.title,
      titleDescription: user.titleDescription,
      postTimes: user.postTimes,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data()!;
    return {
      id: data.id,
      nickname: data.nickname,
      photoURL: data.photoURL,
      createdAt: data.createdAt.toDate(),
      title: data.title,
      titleDescription: data.titleDescription,
      postTimes: data.postTimes,
    };
  },
};

export const getGamesByDate = async (beggining: Date, end: Date): Promise<Game[]> => {
  const queryRef = db
    .collection("games")
    .where("startAt", ">=", beggining)
    .where("startAt", "<", end)
    .withConverter(gameConverter);

  const querySnapshot = await queryRef.get();
  const games = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data() as Game;
  });

  return games;
};

export const getPostsByDate = async (beggining: Date, end: Date): Promise<Post[]> => {
  const queryRef = db
    .collection("posts")
    .where("postedAt", ">=", beggining)
    .where("postedAt", "<", end)
    .withConverter<Post>(postConverter);

  const querySnapshot = await queryRef.get();
  const posts = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
    return doc.data() as Post;
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
