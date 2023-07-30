import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../Api/firebase";
import moment from "moment";

export const FormatDate = (props) => {
  return moment(props.toDate(), "YYYYMMDD").fromNow();
};

export const getData = async () => {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  const Users = snapshot.docs.map((doc) => ({
    id: doc.id,
    email: doc.data().email,
    username: doc.data().username,
    password: doc.data().password,
    avatarUrl: doc.data().avatarUrl,
    bio: doc.data().bio,
    block: doc.data().block
  }));
  return Users
};

export const onSigninGoogle = async (messageApi, navigate, key) => {
  messageApi.open({
    key,
    type: "loading",
    content: "Loading...",
  });
  var provider = new GoogleAuthProvider();
  const data = await signInWithPopup(auth, provider);
  const user = data._tokenResponse;
  const credential = GoogleAuthProvider.credentialFromResult(data);
  const accessToken = credential.accessToken;
  const usersCol = collection(db, "users");
  getData().then(async (data) => {
    const UserData = data.find((value) => value.email === user.email);
    if (UserData === undefined) {
      addDoc(usersCol, {
        bio: '',
        avatarUrl: user.photoUrl,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        fullname: user.fullName,
        username: "",
        password: "",
        friend: [],
        block: []
      }).then((docRef) => {
        localStorage.setItem("ID", docRef.id);
      });
    } else {
      const q = query(usersCol, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        localStorage.setItem("ID", doc.id);
      });
    }
  });

  setTimeout(() => {
    messageApi.open({
      key,
      type: "success",
      content: "Sign In Successfully",
      duration: 2,
      onClose: () => {
        navigate("/");
      },
    });
  }, 1000);
};

export const onSigninYahoo = async (messageApi, navigate, key) => {
  messageApi.open({
    key,
    type: "loading",
    content: "Loading...",
  });
  const provider = new OAuthProvider("yahoo.com");
  const data = await signInWithPopup(auth, provider);
  const user = data._tokenResponse;
  const credential = OAuthProvider.credentialFromResult(data);
  const accessToken = credential.accessToken;
  const usersCol = collection(db, "users");
  const Newuser = getData().then(async (data) => {
    const UserData = data.find((value) => value.email === user.email);
    if (UserData === undefined) {
      addDoc(usersCol, {
        bio: '',
        avatarUrl: user.photoUrl,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        fullname: user.fullName,
        username: "",
        password: "",
        friend: [],
        block: []
      }).then((docRef) => {
        localStorage.setItem("ID", docRef.id);
      });
    } else {
      const q = query(usersCol, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        localStorage.setItem("ID", doc.id);
      });
    }
  })
  messageApi.open({
    key,
    type: "success",
    content: "Sign In Successfully",
    duration: 2,
    onClose: () => {
      navigate("/");
    },
  });
};
