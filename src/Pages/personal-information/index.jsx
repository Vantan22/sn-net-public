import { message, QRCode, Tabs } from "antd";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Api/firebase";
import userEdit from "../../img/PostPersonalInformation/user-edit.svg";
import icon_qr from "../../img/qr/qrcode-scan.png";
import icon_grid from "../../img/vuesax/linear/grid.svg";
import icon_video from "../../img/vuesax/linear/video-play.svg";
import EditProfile from "./EditProfile/EditProfile";
import "./PersonalInformation.css";
import { AddFriend, removeFriend } from "./services/AddAndRemoveFriend";
const PersonalInformation = () => {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [Users, setUsers] = useState([]);
  const [UserCurren, setUserCurren] = useState([]);
  const [Test, setTest] = useState([]);
  const [listShort, setListShort] = useState([]);
  const [PostLength, setPostLength] = useState([]);
  const [friend, setFriend] = useState(false);
  const navigate = useNavigate();
  const [isShowQr, setIsShowQr] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const currentId = localStorage.getItem("ID");
  const wrapperRef = useRef(null);
  const [conversation, setConversation] = useState([]);

  const User = () => {
    onSnapshot(doc(db, "users", id), (doc) => {
      setUsers(doc.data());
    });
    onSnapshot(doc(db, "users", currentId), (doc) => {
      setUserCurren(doc.data());
    });
  };
  const CheckFriend = () => {
    if (id !== currentId) {
      setFriend(true);
    } else {
      setFriend(false);
    }
  };
  useEffect(() => {
    CheckFriend();
    User();
    getPost();
    getShort();
    onSnapshot(
      collection(db, "conversations"),
      (snapshot) => {
        setConversation(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              createdAt: doc.data().createdAt,
              participants: doc.data().participants,
              lastMessage: doc.data().lastMessage,
              unreadCount: doc.data().unreadCount,
              userIds: doc.data().userIds,
            }))
            .filter(
              (e) => e.userIds[0] == currentId || e.userIds[1] == currentId
            )
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }, [id]);
  //get bài post từ id user
  const getPost = async () => {
    const q = query(collection(db, "postItem"), where("userId", "==", id));
    onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push({
          ...doc.data(),
          idPost: doc.id,
        });
      });
      setTest(cities);
      setPostLength(cities.length);
    });
  };

  //get short video từ id user
  const getShort = async () => {
    const q = query(collection(db, "shortVideo"), where("userId", "==", id));
    onSnapshot(q, (querySnapshot) => {
      const shorts = [];
      querySnapshot.forEach((doc) => {
        shorts.push({
          ...doc.data(),
          idShort: doc.id,
        });
      });
      setListShort(shorts);
    });
  };

  const handleUserSelect = async () => {
    const checkConversation = conversation.filter(
      (e) => e.userIds[0] === id || e.userIds[1] === id
    );
    const conversationRef = collection(db, "conversations");
    const usersCol = collection(db, "notification");
    if (checkConversation.length === 0) {
      await addDoc(conversationRef, {
        userIds: [id, currentId],
        createdAt: serverTimestamp(),
        lastMessage: null,
        unreadCount: 0,
        participants: [
          {
            userId: id,
            userName: Users.username,
            avatarUrl: Users.avatarUrl,
          },
          {
            userId: currentId,
            userName: UserCurren.username,
            avatarUrl: UserCurren.avatarUrl,
          },
        ],
        messages: [],
      }).then((docRef) => {
        addDoc(usersCol, {
          sender: currentId,
          receiver: [id],
          avatarUrl: UserCurren.avatarUrl,
          userName: UserCurren.username,
          fullname: UserCurren.fullname,
          messageTo: ``,
          messageFrom: `You have a new chat with ${UserCurren.fullname}.`,
          createAt: serverTimestamp(),
          idpost: docRef.id,
          status: 4,
        });
        navigate(`/Messenger/${docRef.id}`);
      });
    } else {
      navigate(`/Messenger/${checkConversation[0]?.id}`);
    }
  };
  const find = UserCurren?.friend?.find((value) => value.id === id);
  const onAddFriend = async () => {
    AddFriend(currentId, id, messageApi, UserCurren, Users);
  };
  const onCancelRequest = async () => {
    removeFriend(currentId, id, messageApi);
  };

  // xử lí modal đóng

  const handleModal = (e) => {
    setIsModalActive(e);
  };

  const navigateFriends = () => {
    navigate("/Friends/AllFriends");
  };
  useEffect(() => {
    // Lắng nghe sự kiện click để đóng editComment khi click ra ngoài
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowQr(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <>
      {<Outlet />}
      {isModalActive ? <EditProfile handleModal={handleModal} /> : ""}
      {contextHolder}
      <div className="PersonalInformation">
        <div className="avatar">
          <div>
            <div>
              <img src={Users.avatarUrl} className="userItem-avatar" />
            </div>
            <div className="UserItem-Name">
              <span className="wrap-UserItem-Name">
                {Users.fullname}{" "}
                {friend ? (
                  find ? (
                    find.status === 1 ?
                      <span
                        className="btn btn-addFriend"
                        onClick={onCancelRequest}
                      >
                        {"Unfriend"}
                      </span> :
                      <span
                        className="btn btn-addFriend"
                        onClick={onCancelRequest}
                      >
                        {"Cancel request"}
                      </span>

                  ) : (
                    <span className="btn btn-addFriend" onClick={onAddFriend}>
                      {"Add Friend"}
                    </span>
                  )
                ) : (
                  <img
                    src={userEdit}
                    alt=""
                    onClick={() => {
                      setIsModalActive(true);
                    }}
                  />
                )}
                {friend ? (
                  <span className="btn btn-message" onClick={handleUserSelect}>
                    {"Message"}
                  </span>
                ) : (
                  ""
                )}
                <img
                  src={icon_qr}
                  alt=""
                  className="profile-qr-icon"
                  onClick={() => {
                    setIsShowQr(true);
                  }}
                />
                {isShowQr && (
                  <div className="profile-qr-code" ref={wrapperRef}>
                    <QRCode
                      errorLevel="H"
                      value={`https://vawntan.web.app/Profile/${id}`}
                      icon="https://firebasestorage.googleapis.com/v0/b/social-network-68ab1.appspot.com/o/LOGO%2Fsmail%20logo.png?alt=media&token=e4bcbcf0-52cf-439c-8577-a5e14b02b811"
                    />
                  </div>
                )}
              </span>
              <div className="total">
                {PostLength > 1 ? (
                  <p>{PostLength} Posts</p>
                ) : (
                  <p>{PostLength} Post</p>
                )}
                {listShort?.length > 1 ? (
                  <p>{listShort?.length} Shorts</p>
                ) : (
                  <p>{listShort?.length} Short</p>
                )}
                {Users.friend?.filter((value) => value.status === 1).length >
                  1 ? (
                  <p onClick={navigateFriends}>
                    {Users.friend?.filter((value) => value.status === 1).length}{" "}
                    Friends
                  </p>
                ) : (
                  <p onClick={navigateFriends}>
                    {Users.friend?.filter((value) => value.status === 1).length}{" "}
                    Friend
                  </p>
                )}
              </div>
              <div className="description">
                <p>{Users?.bio}</p>
              </div>
            </div>
          </div>
        </div>
        <Tabs
          // centered={true}

          tabPosition="top"
          className="max-width"
          defaultActiveKey="1"
          items={[icon_grid, icon_video].map((Icon, i) => {
            const id = String(i + 1);
            if (id == 1) {
              return {
                label: (
                  <span className="wrapViewPosts">
                    <img src={icon_grid} alt="" className="iconGridPost" />
                    <span className="textGridPost">Posts</span>
                  </span>
                ),
                key: id,
                children: (
                  <div className="PostPersonalInformation">
                    {Test.map((value, index) => (
                      <div
                        key={index}
                        className="PostPersonalInformation-Container"
                      >
                        <img src={value.image} alt="" />
                        <Link className="overlay" to={`${value.idPost}`}></Link>
                      </div>
                    ))}
                  </div>
                ),
              };
            } else {
              return {
                label: (
                  <span className="wrapViewShorts">
                    <img src={icon_video} alt="" className="iconShortVideo" />
                    <span className="textShortVideo">Shorts</span>
                  </span>
                ),
                key: id,
                children: (
                  <div className="PostPersonalInformation">
                    {listShort.map((value, index) => (
                      <div
                        key={index}
                        className="ShortPersonalInformation-Container"
                      >
                        <Link to={`/short/${value.idShort}`}>
                          <video src={value.videoUrl} alt="" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ),
              };
            }
          })}
        />
      </div>
    </>
  );
};

export default PersonalInformation;
