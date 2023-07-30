import React, { useEffect, useState } from "react";
import "./UserItem.css";
import { Link } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../Api/firebase";
import { message } from "antd";
import { AddFriend } from "../../personal-information/services/AddAndRemoveFriend";

const UserItem = ({ dataUser, userTitle }) => {
  const currentID = localStorage.getItem("ID");
  const [messageApi, contextHolder] = message.useMessage();

  const [UserCurren, setUserCurren] = useState([]);

  useEffect(() => {
    const User = () => {
      onSnapshot(doc(db, "users", currentID), (doc) => {
        setUserCurren(doc.data());
      });
    };
    return User;
  }, []);

  const handleAddfriend = async () => {
    const frankDocRef2 = doc(db, "users", dataUser.id);
    const postDoc = await getDoc(frankDocRef2);
    AddFriend(currentID, dataUser.id, messageApi, UserCurren, postDoc.data());
  };
  return (
    <>
      <div className="UserItem-wrapper">
        <Link to={`/Profile/${dataUser.id}`} className="flex">
          <div>
            <img src={dataUser.avatarUrl} className="userItem-avatar" />{" "}
          </div>
          <div className="UserItem-Name">
            <span>{dataUser.fullName}</span>
            {userTitle ? <p>Suggestion for you</p> : ""}
          </div>
        </Link>

        {userTitle ? (
          <span className="userItem-link" onClick={handleAddfriend}>
            Add friend
          </span>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default UserItem;
