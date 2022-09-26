import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { User } from "@/types/User";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "@/lib/firestore";
import { auth } from "@/lib/authentication";
import { setDoc } from "@firebase/firestore";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const appUser = (await getDoc(ref)).data() as User;
          setUser(appUser);
        } else {
          const appUser: User = {
            id: firebaseUser.uid,
            // 初回登校時に直接入力してもらう（過去と同じニックネームの入力を期待する）
            nickname: "",
            photoURL: firebaseUser.photoURL!,
            createdAt: new Date(),
          };
          setDoc(ref, appUser).then(() => setUser(appUser));
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
