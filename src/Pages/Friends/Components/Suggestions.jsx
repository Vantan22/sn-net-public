import { doc, onSnapshot, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../Api/firebase";
import { message } from "antd";
import { getDocumentUser } from "../../Newsfeeds/services/services";
import { AddFriend } from "../../personal-information/services/AddAndRemoveFriend";
const Suggestions = () => {
  const currentID = localStorage.getItem("ID");
  const [UserCurren, setUserCurren] = useState([]);
  const [Users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const User = () => {
    onSnapshot(doc(db, "users", currentID), (doc) => {
      setUserCurren(doc.data());
    });
  };
  useEffect(() => {
    getDocumentUser().then((data) => {
      setUsers(data);
    });
    User();
  }, []);

  const Suggetions = Users.filter(
    (objA) => !UserCurren.friend.some((objB) => objA.id === objB.id)
  );
  const addFriend = async (id) => {
    const frankDocRef2 = doc(db, "users", id);
    const postDoc = await getDoc(frankDocRef2);
    AddFriend(currentID, id, messageApi, UserCurren, postDoc.data());
  };
  return (
    <>
      {contextHolder}
      <div className="wrap_container_homeFriend">
        <div className="title_homeFriend">
          <span className="text_title_homeFriend">People you may know</span>
          <Link className="link_title_homeFriend">See all</Link>
        </div>
        <div className="row-grid">
          {Suggetions.filter(
            (item, index) => index < 12 && item.id !== currentID
          ).map((item, index) => (
            <div key={index} className="chirdsasas">
              <img src={item.avatarUrl} alt="" className="chirdsasas_img" />
              <Link
                to={`/Profile/${item.id}`}
                style={{
                  color: "#000000",
                  display: "block",
                  marginTop: "10px",
                }}
              >
                <span className="userName_chirdsasas">{item.fullName}</span>
              </Link>
              <div className="wrap_btnChirdsasas">
                <span
                  onClick={() => {
                    addFriend(item.id);
                  }}
                  className="btn_chirdsasas btn_chirdsasas-confirm"
                >
                  AddFriend
                </span>
                <span className="btn_chirdsasas btn_chirdsasas-delete">
                  Delete
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Suggestions;
