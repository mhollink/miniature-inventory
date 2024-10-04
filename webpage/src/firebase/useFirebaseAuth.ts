import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase.ts";

export const useFirebaseAuth = () => {
  const navigate = useNavigate();

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      ({ user }) => updateProfile(user, { displayName }),
    );
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/inventory");
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/inventory");
  };

  const signOutWrapper = async () => {
    await signOut(auth);
    navigate("/");
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut: signOutWrapper,
  };
};
