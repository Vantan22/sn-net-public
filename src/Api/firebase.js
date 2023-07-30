import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyA8ZyVOHrJiWdDuZp7g1IS9TmSfyYaD_XY",
  authDomain: "social-network-68ab1.firebaseapp.com",
  projectId: "social-network-68ab1",
  storageBucket: "social-network-68ab1.appspot.com",
  messagingSenderId: "690156407214",
  appId: "1:690156407214:web:b6bcec2aa8d653a339e03f",
  measurementId: "G-P8RD7SV68D",
  // apiKey: "AIzaSyC8yWcLoFfOWK4hBDDnGLTIoAjhy4a_qxw",
  // authDomain: "social-network-826a9.firebaseapp.com",
  // databaseURL: "https://social-network-826a9-default-rtdb.firebaseio.com",
  // projectId: "social-network-826a9",
  // storageBucket: "social-network-826a9.appspot.com",
  // messagingSenderId: "795485769634",
  // appId: "1:795485769634:web:10fcfc3870e39037842cfb",
  // measurementId: "G-MDVM9Q2D5H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

