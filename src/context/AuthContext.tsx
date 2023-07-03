import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { signInAnonymously } from "@firebase/auth";
import { User } from "@/types/User";
import { auth } from "@/lib/authentication";

type AuthContextProps = {
  user: User | null | undefined;
};
const AuthContext = createContext<AuthContextProps>({ user: undefined });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (user) {
      return;
    }

    signInAnonymously(auth)
      .then((userCred) => {
        if (userCred) {
          setUser({
            id: userCred.user.uid,
            providerId: userCred.user.providerId,
          });
        }
      })
      .catch((e) => {
        console.error("failed auth: " + e);
      });
  }, [user]);

  return <AuthContext.Provider value={{ user: user }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
