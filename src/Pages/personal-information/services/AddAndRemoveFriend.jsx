import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Api/firebase";
export const AddFriend = async (
  currentID,
  id,
  messageApi,
  UserCurren,
  Users
) => {
  const usersCol = collection(db, "notification");
  const frankDocRef = doc(db, "users", currentID);
  const frankDocRef2 = doc(db, "users", id);
  if (UserCurren.friend?.length === 0) {
    updateDoc(frankDocRef, {
      friend: [
        ...UserCurren.friend,
        {
          id: id,
          status: 0,
          to: 1,
        },
      ],
    }).then(() => {
      addDoc(usersCol, {
        sender: currentID,
        receiver: [id],
        avatarUrl: UserCurren.avatarUrl,
        userName: UserCurren.username,
        fullname: UserCurren.fullname,
        messageTo: ``,
        messageFrom: `You have received a friend request from`,
        createAt: serverTimestamp(),
        idpost: "",
        status: 0,
      });
      messageApi.open({
        type: "success",
        content: "Friend request sent successfully",
        duration: 1,
      });
    });
  } else {
    const find = UserCurren.friend?.find((value) => value.id === id)
    if (!find) {
      updateDoc(frankDocRef, {
        friend: [
          ...UserCurren.friend,
          {
            id: id,
            status: 0,
            to: 1,
          },
        ],
      }).then(() => {
        addDoc(usersCol, {
          sender: currentID,
          receiver: [id],
          avatarUrl: UserCurren.avatarUrl,
          userName: UserCurren.username,
          fullname: UserCurren.fullname,
          messageTo: ``,
          messageFrom: `You have received a friend request from`,
          createAt: serverTimestamp(),
          idpost: "",
          status: 0,
        });
        messageApi.open({
          type: "success",
          content: "Friend request sent successfully",
          duration: 1,
        });
      });
    }
  }

  if (Users.friend?.length === 0) {
    updateDoc(frankDocRef2, {
      friend: [
        ...Users.friend,
        {
          id: currentID,
          status: 0,
          to: 2,
        },
      ],
    });
  } else {
    const find = Users.friend.find((value) => value.id === currentID)
    if (!find) {
      updateDoc(frankDocRef2, {
        friend: [
          ...Users.friend,
          {
            id: currentID,
            status: 0,
            to: 2,
          },
        ],
      });
    }
  }
};
export const removeFriend = async (currentID, id) => {
  const frankDocRef = doc(db, "users", currentID);
  const docSnap = await getDoc(frankDocRef);
  const docData = docSnap.data();
  const test = docData["friend"].findIndex((friend) => friend.id === id);
  if (test !== -1) {
    const newFriends = arrayRemove(docData["friend"][test]);
    await updateDoc(frankDocRef, { ['friend']: newFriends });
  }
  const frankDocRef2 = doc(db, "users", id);
  const docSnap2 = await getDoc(frankDocRef2);
  const docData2 = docSnap2.data();
  const test2 = docData2["friend"].findIndex(
    (friend) => friend.id === currentID
  );
  if (test2 !== -1) {
    const newFriends2 = arrayRemove(docData2["friend"][test2]);
    await updateDoc(frankDocRef2, { ["friend"]: newFriends2 });
  }
};

export const ConfirmRequest = async (currentID, id) => {
  const frankDocRef = doc(db, "users", currentID);
  const docSnap = await getDoc(frankDocRef);
  const docData = docSnap.data();
  const test = docData["friend"].findIndex((friend) => friend.id === id);
  if (test !== -1) {
    const updatedFriend = {
      ...docData["friend"][test],
      status: 1,
    };
    const newFriends = [...docData["friend"]];
    newFriends[test] = updatedFriend;
    await updateDoc(frankDocRef, { friend: newFriends });
  }
  const frankDocRef2 = doc(db, "users", id);
  const docSnap2 = await getDoc(frankDocRef2);
  const docData2 = docSnap2.data();
  const test2 = docData2["friend"].findIndex((friend) => friend.id === currentID);

  if (test2 !== -1) {
    const updatedFriend2 = {
      ...docData2["friend"][test2],
      status: 1,
    };
    const newFriends2 = [...docData2["friend"]];
    newFriends2[test2] = updatedFriend2;
    await updateDoc(frankDocRef2, { friend: newFriends2 });
  }
};
