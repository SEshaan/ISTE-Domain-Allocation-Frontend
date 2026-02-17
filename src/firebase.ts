import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJLazpi_0rKVF_x8bp60UjG2sM9xU6klo",
  authDomain: "iste-domain-allocation.firebaseapp.com",
  projectId: "iste-domain-allocation",
  storageBucket: "iste-domain-allocation.firebasestorage.app",
  messagingSenderId: "441750940331",
  appId: "1:441750940331:web:82110d2963805cf9b025ee",
  measurementId: "G-ZCJ1EGBFVG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider().setCustomParameters({
  hd: "vitstudent.ac.in",
  prompt: "select_account"
});
