import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFWpRp7OekWJ4FLjeC1X_GJODlnEsojA4",
  authDomain: "my-entertainment-list.firebaseapp.com",
  projectId: "my-entertainment-list",
  storageBucket: "my-entertainment-list.firebasestorage.app",
  messagingSenderId: "604152209019",
  appId: "1:604152209019:web:fa56a7df508fba1b39ccde"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);