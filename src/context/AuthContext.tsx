import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { User } from "@/types/User";
import { getUser, updateUser } from "@/lib/firestore";
import { auth } from "@/lib/authentication";

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let appUser = await getUser(firebaseUser.uid);

        if (appUser) {
          setUser(appUser);
        } else {
          appUser = {
            id: firebaseUser.uid,
            nickname: firebaseUser.displayName || "(未設定)",
            photoURL: firebaseUser.photoURL!,
            createdAt: new Date(),
            title: "",
            titleDescription: "",
            postTimes: 0,
          };
          updateUser(appUser).then(() => setUser(appUser));
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
