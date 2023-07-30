import { message } from "antd";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../Api/firebase";
import { getDocumentUser } from "../../Newsfeeds/services/services";
import {
  AddFriend,
  ConfirmRequest,
  removeFriend,
} from "../../personal-information/services/AddAndRemoveFriend";
const Home = () => {
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
    (objA) => !UserCurren?.friend.some((objB) => objA.id === objB.id)
  );
  const Suggetions2 = Suggetions.filter(
    (objA) => !UserCurren?.block.some((objB) => objA.id === objB.id)
  );

  const Friend = Users.filter((objA) =>
    UserCurren?.friend.some(
      (objB) =>
        objA.id === objB.id && objB.status === 0 && objB.to !== 1
    )
  );

  const addFriend = async (id) => {
    const frankDocRef2 = doc(db, "users", id);
    const postDoc = await getDoc(frankDocRef2);
    AddFriend(currentID, id, messageApi, UserCurren, postDoc.data());
  };
  const remove = (id) => {
    removeFriend(currentID, id);
  };
  const confirm = (id) => {
    ConfirmRequest(currentID, id)
  }
  const Active = (id) => {
    const frankDocRef = doc(db, "users", currentID);
    const find = UserCurren.block.find((value) => value.id === id)
    if (!find) {
      updateDoc(frankDocRef, {
        block: [
          ...UserCurren.block,
          {
            id: id,
          },
        ],
      })
    }
  }

  return (
    <>
      {contextHolder}
      {Friend.length !== 0 ? <div className="wrap_container_homeFriend">
        <div className="title_homeFriend">
          <span className="text_title_homeFriend">Friends request</span>
          <Link to="/Friends/FriendsRequest" className="link_title_homeFriend">
            See all
          </Link>
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
                <span onClick={() => { confirm(item.id) }} className="btn_chirdsasas btn_chirdsasas-confirm">
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
      </div> : ''}
      <div className="wrap_container_homePeoplekmow">
        <div className="title_homeFriend">
          <span className="text_title_homeFriend">People you may know</span>
          <Link to="/Friends/Suggestions" className="link_title_homeFriend">
            See all
          </Link>
        </div>
        <div className="row-grid">
          {Suggetions2.filter(
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
                <span onClick={() => { Active(item.id) }} className="btn_chirdsasas btn_chirdsasas-delete">
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

export default Home;
