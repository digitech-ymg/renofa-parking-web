import { firebaseApp, isEmulator } from "@/lib/firebase";
import {
  connectAuthEmulator,
  getAuth,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
  UserCredential,
} from "@firebase/auth";

export const auth = getAuth(firebaseApp);
if (isEmulator()) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export const login = (): Promise<UserCredential> => {
  const provider = new TwitterAuthProvider();
  return signInWithRedirect(auth, provider).then((result: UserCredential) => {
    console.dir(result.user);
    return result;
  });
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};
