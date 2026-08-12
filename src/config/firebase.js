import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVFJzPEOnqUFQgVRorZhb9U1c026TSHJc",
  authDomain: "tile-house23.firebaseapp.com",
  projectId: "tile-house23",
  storageBucket: "tile-house23.firebasestorage.app",
  messagingSenderId: "506202320338",
  appId: "1:506202320338:web:1f26c42d167ce70200ec0b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
