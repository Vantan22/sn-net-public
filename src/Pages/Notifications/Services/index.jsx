import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../Api/firebase";
import { FormatDate } from "../../Signin_Signup/Services";
export const getDataNoti = async () => {
  const usersCol = collection(db, "notification");
  const snapshot = await getDocs(usersCol);
  const notification = snapshot.docs.map((doc) => ({
    id: doc.id,
    messageTo: doc.data().messageTo,
    messageFrom: doc.data().messageFrom,
    sender: doc.data().sender,
    receiver: doc.data().receiver,
    createAt: doc.data().createAt,
    avatarUrl:doc.data().avatarUrl,
    userName:doc.data().userName,
    fullname:doc.data().fullname,
  }));
  return notification;
};

