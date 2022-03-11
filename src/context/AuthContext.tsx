import { createContext, useEffect, useState, useContext } from "react";
import { getAuth, connectAuthEmulator, signInAnonymously } from "@firebase/auth";
import { firebaseApp, isEmulator } from "@/lib/firebase";
import { User } from "@/types/User";

const auth = getAuth(firebaseApp);
if (isEmulator()) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

type AuthContextProps = {
  user: User | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({ user: undefined });

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (user) {
      return;
    }

    signInAnonymously(getAuth(firebaseApp))
      .then((userCred) => {
        if (userCred) {
          setUser({
            uid: userCred.user.uid,
            providerId: userCred.user.providerId,
          });
        }
      })
      .catch((e) => {
        console.error("failed auth: " + e);
      });
  });

  return <AuthContext.Provider value={{ user: user }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
