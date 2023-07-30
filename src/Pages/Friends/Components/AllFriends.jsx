import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { db } from "../../../Api/firebase";
import icon_trash from "../../../img/trash/trash-alt.png";
import { getDocumentUser } from "../../Newsfeeds/services/services";
import { Button, Modal } from "antd";
import { removeFriend } from "../../personal-information/services/AddAndRemoveFriend";
const AllFriends = () => {
  const currentID = localStorage.getItem("ID");
  const [UserCurren, setUserCurren] = useState([]);
  const [Users, setUsers] = useState([]);
  const [thisFriend, setThisFriend] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Are you sure you want to delete this friend?"
  );
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

  const Friend = Users.filter((objA) =>
    UserCurren.friend.some((objB) => objA.id === objB.id && objB.status === 1)
  );
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText("ok wait a minute");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      removeFriend(currentID, thisFriend.id);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Unfriend ? "
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <div className="wrap-allFriends">
        <div className="listAllFriends">
          <span className="listAllFriends-count">
            {Friend?.length < 2
              ? `${Friend?.length} Friend`
              : `${Friend?.length} Friends`}
          </span>
          <hr className="listAllFriends-line" />
          <div className="wrap-listAllFriendsItems">
            {Friend.filter((item, index) => index < 12).map((item, index) => (
              <div className="listAllFriendsItem" key={Math.random()}>
                <Link
                  to={`/Friends/AllFriends/${item.id}`}
                  className="wrap-listAllFriendsItemInfo"
                >
                  <img
                    src={item.avatarUrl}
                    alt=""
                    className="listAllFriendsItem-img"
                  />
                  <span className="listAllFriendsItem-Name">
                    {item.fullName}
                  </span>
                </Link>

                <img
                  onClick={() => {
                    setOpen(true);
                    setThisFriend(item);
                  }}
                  src={icon_trash}
                  alt=""
                  className="listAllFriendsItem-iconMore"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="infor-allFriends">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AllFriends;
