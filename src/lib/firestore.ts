import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  where,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";

import { firebaseApp, isEmulator } from "./firebase";
import type { Parking } from "../types/Parking";
import { Game } from "../types/Game";
import { Post } from "../types/Post";
import { User } from "../types/User";
import { Information } from "@/types/Information";

export const db = getFirestore(firebaseApp);
if (isEmulator()) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

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
      parkingOpenAdjustments: game.parkingOpenAdjustments,
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
      parkingOpenAdjustments: data.parkingOpenAdjustments,
      opponent: data.opponent,
      attendance: data.attendance,
      result: data.result,
      goalScore: data.goalScore,
      goalAgainst: data.goalAgainst,
    };
  },
};

export const getMostRecentGame = async (): Promise<Game> => {
  const ref = collection(db, "games");
  // 当日0時以降の直近の試合を1つ取得する（試合当日は試合が終わってもその日の終日まで対象になる）
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const q = query(ref, where("startAt", ">=", today), limit(1)).withConverter(gameConverter);

  const parkingSnapshot = await getDocs(q);

  if (parkingSnapshot.docs.length === 0) {
    throw new Error("game not found");
  }
  return parkingSnapshot.docs[0].data();
};

export const getPreviousGame = async (): Promise<Game> => {
  const ref = collection(db, "games");
  // 当日0時以前の直近の試合を1つ取得する
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const q = query(
    ref,
    where("startAt", "<", today),
    limit(1),
    orderBy("startAt", "desc")
  ).withConverter(gameConverter);

  const parkingSnapshot = await getDocs(q);

  if (parkingSnapshot.docs.length === 0) {
    throw new Error("game not found");
  }
  return parkingSnapshot.docs[0].data();
};

export const getNextGame = async (): Promise<Game> => {
  const ref = collection(db, "games");
  // 当日0時以降の直近の試合を1つ取得する（試合当日は試合が終わってもその日の終日まで対象になる）
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const q = query(ref, where("startAt", ">=", today), limit(1)).withConverter(gameConverter);

  const parkingSnapshot = await getDocs(q);

  if (parkingSnapshot.docs.length === 0) {
    throw new Error("game not found");
  }
  return parkingSnapshot.docs[0].data();
};

export const isOffSeason = async (): Promise<Boolean> => {
  const previousGame = await getPreviousGame();
  const nextGame = await getNextGame();

  const diff = nextGame.startAt.getTime() - previousGame.startAt.getTime();
  const diffInDays = diff / (1000 * 60 * 60 * 24);

  if (diffInDays >= 30) {
    return true;
  }
  return false;
};

const parkingConverter = {
  toFirestore(parking: Parking): DocumentData {
    return {
      id: parking.id,
      name: parking.name,
      officialName: parking.officialName,
      address: parking.address,
      carCapacity: parking.carCapacity,
      distanceToStadium: parking.distanceToStadium,
      timeToStadium: parking.timeToStadium,
      latitude: parking.latitude,
      longitude: parking.longitude,
      routeUrl: parking.routeUrl,
      hourToOpen: parking.hourToOpen,
      hourToClose: parking.hourToClose,
      predictParkingStates: parking.predictParkingStates,
      adoptionParkingStates: parking.adoptionParkingStates,
      images: parking.images,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Parking {
    const data = snapshot.data()!;
    return {
      id: data.id,
      name: data.name,
      officialName: data.officialName,
      address: data.address,
      carCapacity: data.carCapacity,
      distanceToStadium: data.distanceToStadium,
      timeToStadium: data.timeToStadium,
      latitude: data.latitude,
      longitude: data.longitude,
      routeUrl: data.routeUrl,
      hourToOpen: data.hourToOpen,
      hourToClose: data.hourToClose,
      predictParkingStates: data.predictParkingStates,
      adoptionParkingStates: data.adoptionParkingStates,
      images: data.images,
    };
  },
};

export const getParkings = async (): Promise<Parking[]> => {
  const ref = collection(db, "parkings");
  const q = query(ref, orderBy("order")).withConverter(parkingConverter);

  const parkingSnapshot = await getDocs(q);
  const parkingList = parkingSnapshot.docs.map((doc) => doc.data());
  return parkingList;
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
      parkedAt: data.parkedAt,
      postedAt: data.postedAt.toDate(),
      userId: data.userId,
    };
  },
};

export const createPost = async (post: Post): Promise<void> => {
  const dateUTC = new Date();
  const diffJST = dateUTC.getTimezoneOffset() * 60 * 1000;
  const id = new Date(dateUTC.getTime() - diffJST).toISOString().replace(/[^0-9]/g, "");

  const ref = doc(db, "posts", id).withConverter(postConverter);
  return await setDoc(ref, post);
};

export const deletePost = async (
  userId: string,
  gameId: string,
  parkingId: string
): Promise<void> => {
  const qRef = collection(db, "posts");
  const q = query(
    qRef,
    where("gameId", "==", gameId),
    where("userId", "==", userId),
    where("parkingId", "==", parkingId)
  );
  const snapshot = await getDocs(q);
  const idList = snapshot.docs.map((doc) => doc.id);

  // 削除対象無し
  if (idList.length === 0) {
    return Promise.resolve();
  }

  // 削除実行、先頭の一件（複数にならない前提）
  const ref = doc(db, `posts/${idList[0]}`);
  return deleteDoc(ref);
};

export const getPosts = async (key: string, gameId: string): Promise<Post[]> => {
  const ref = collection(db, "posts");
  // 6時間前が駐車場会場最速なのでそれ以降に絞る
  const q = query(
    ref,
    where("gameId", "==", gameId),
    where("parkingMinutes", ">", -360),
    orderBy("parkingMinutes")
  ).withConverter(postConverter);

  const snapshot = await getDocs(q);
  const postList = snapshot.docs.map((doc) => doc.data());
  return postList;
};

const informationConverter = {
  toFirestore(info: Information): DocumentData {
    return {
      id: info.id,
      showFinishAt: info.showFinishAt,
      text: info.text,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Information {
    const data = snapshot.data()!;
    return {
      id: data.id,
      showFinishAt: data.showFinishAt.toDate(),
      text: data.text,
    };
  },
};

// export const getShowableInformations = async (now: Date): Promise<Information[]> => {
export const getShowableInformations = async (): Promise<Information[]> => {
  const now = new Date();
  console.log(`now: ${now.toLocaleString()}`);

  const ref = collection(db, "informations");
  const q = query(ref, where("showFinishAt", ">", now), orderBy("showFinishAt")).withConverter(
    informationConverter
  );

  const snapshot = await getDocs(q);
  const infoList = snapshot.docs.map((doc) => doc.data());
  return infoList;
};
