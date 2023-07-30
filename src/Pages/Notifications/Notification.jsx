import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Api/firebase";
import NotiItem from "../../Components/NotiItem";
import "./Notification.css";

const Notification = ({ defaultMenu }) => {
  const currentID = localStorage.getItem("ID");
  const [Notifications, setNotifications] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "notification"),
      where("receiver", "array-contains", currentID),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      });
      setNotifications(cities);
    });
  }, []);
  if (defaultMenu) return null;
  else
    return (
      <div className="Notification">
        <h2>Notification</h2>
        <hr />
        <div className="Notification-content">
          {Notifications?.map((e) => (
            <NotiItem
              key={Math.random()}
              avatar={e.avatarUrl}
              notidesc={e.messageFrom}
              param={
                e.status === 0
                  ? "Friends/FriendsRequest"
                  : e.status === 4
                  ? `/Messenger/${e.idpost}`
                  : e.status === 1 || e.status === 2 || e.status === 3
                  ? e.idpost
                  : `short/${e.idpost}`
              }
            />
          ))}
        </div>
      </div>
    );
};

export default Notification;
