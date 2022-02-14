import { getApps, getApp, initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  FirestoreDataConverter,
  WithFieldValue,
  QueryDocumentSnapshot,
  DocumentData,
  SetOptions,
  Timestamp,
} from "firebase/firestore/lite";

import { Parking } from "@/types/Parking";
import { Game } from "@/types/Game";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const apps = getApps();
const app = apps.find(({ name }) => name == "client")
  ? getApp("client")
  : initializeApp(firebaseConfig, "client");
const db = getFirestore(app);

const gameConverter = {
  toFirestore(game: Game): DocumentData {
    console.log("game.startAt: " + game.startAt);
    return {
      kind: game.kind,
      section: game.section,
      partner: game.partner,
      thanksday: game.thanksday,
      startAt: Timestamp.fromDate(game.startAt),
      finishAt: Timestamp.fromDate(game.finishAt),
      opponent: game.opponent,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Game {
    const data = snapshot.data()!;
    return {
      kind: data.kind,
      section: data.section,
      partner: data.partner,
      thanksday: data.thanksday,
      startAt: data.startAt.toDate(),
      finishAt: data.finishAt.toDate(),
      opponent: data.opponent,
    };
  },
};

export const getMostRecentGame = async (): Promise<Game> => {
  const ref = collection(db, "games");
  // 当日の試合を終日見せる（日が変わったら次の試合になる）
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const q = query(ref, where("startAt", ">=", today), limit(1)).withConverter(gameConverter);

  const parkingSnapshot = await getDocs(q);

  if (parkingSnapshot.docs.length === 0) {
    throw new Error("game not found");
  }

  return parkingSnapshot.docs[0].data();
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
      status: parking.status,
      predicts: parking.predicts,
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
      status: data.status,
      predicts: data.predicts,
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
