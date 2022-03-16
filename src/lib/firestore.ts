import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore/lite";

import { firebaseApp, isEmulator } from "@/lib/firebase";
import { Parking } from "@/types/Parking";
import { Game } from "@/types/Game";

const db = getFirestore(firebaseApp);
if (isEmulator()) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

const gameConverter = {
  toFirestore(game: Game): DocumentData {
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
