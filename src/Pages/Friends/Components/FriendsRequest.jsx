import React, { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import testimg from "../../../img/123123.png";
import { message } from "antd";
import { getDocumentUser } from "../../Newsfeeds/services/services";
import {
  ConfirmRequest,
  removeFriend,
} from "../../personal-information/services/AddAndRemoveFriend";
import { db } from "../../../Api/firebase";
const FriendsRequest = () => {
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
  const remove = (id) => {
    removeFriend(currentID, id);
  };
  const confirm = (id) => {
    ConfirmRequest(currentID, id);
  };
  const Friend = Users.filter((objA) =>
    UserCurren.friend.some(
      (objB) => objA.id === objB.id && objB.status === 0 && objB.to !== 1
    )
  );

  return (
    <>
      {contextHolder}
      <div className="wrap_container_homePeoplekmow">
        <div className="title_homeFriend">
          <span className="text_title_homeFriend">Friends request </span>
          <Link className="link_title_homeFriend">See all</Link>
        </div>
        <div className="row-grid">
          {Friend.filter((item, index) => index < 12).map((item, index) => (
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
                    confirm(item.id);
                  }}
                  className="btn_chirdsasas btn_chirdsasas-confirm"
                >
                  Confirm
                </span>
                <span
                  onClick={() => remove(item.id)}
                  className="btn_chirdsasas btn_chirdsasas-delete"
                >
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

export default FriendsRequest;
