
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import moment from "moment";
import { db } from "../../../Api/firebase";

export const getDocumentUser = async () => {
  const queryy = collection(db, "users");
  const snapshot = await getDocs(queryy);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    userName: doc.data().username,
    fullName: doc.data().fullname,
    avatarUrl: doc.data().avatarUrl,
  }));
};

export const getDocumentPost = async () => {
  const queryy = collection(db, "postItem");
  const q = query(queryy, orderBy("createdAt", "desc"));

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        timeElapsed: moment(doc.data().createdAt.toDate()).fromNow(),
      }));
      resolve(data);
    }, (error) => {
      reject(error);
    });
    // remember to unsubscribe when component unmounts
    return unsubscribe;
  });
};


export const UpdateDocumentLikes = async (ID, data) => {
  const postRef = doc(collection(db, "postItem"), ID);
  await updateDoc(postRef, data);
};

export const heartHandler = async (heartActive, dataPostAPI, CURRENT_ID, setHeartActive) => {

  const postRef = doc(collection(db, "postItem"), dataPostAPI.id);

  const currentUserLiked = dataPostAPI.likes.includes(CURRENT_ID);
  const newLikes = currentUserLiked
    ? dataPostAPI.likes.filter((id) => id !== CURRENT_ID)
    : [...dataPostAPI.likes, CURRENT_ID];
  await updateDoc(postRef, { likes: [...newLikes] });
  setHeartActive(!heartActive);
};
