import { Input, message, Modal } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import moment from "moment";
import "rc-slider/assets/index.css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../../Api/firebase";
import icon__pencil from "../../../img/edit-icon/edit.png";
import icon_edit
  from "../../../img/edit-icon/navigation/14 - navigation, aligned, dots, more, horizontal, three dots, option icon.png";
import icon__trash from "../../../img/edit-icon/trash-alt.png";
import icon_heart from "../../../img/heart.svg";
import icon_heartActive from "../../../img/heartabcd.svg";
import icon_comments from "../../../img/messagecomments.svg";
import icon_unMute from "../../../img/mute_Icon/vuesax/linear/volume-high.png";
import icon_mute from "../../../img/mute_Icon/vuesax/linear/volume-slash.png";
import icon_play from "../../../img/play/vuesax/linear/play.png";
import icon_clock from "../../../img/vuesax/linear/clock.png";
import ModalComment from "../Modal/modalComment/ModalComment";
import "./ShortItem.css";
import { AddFriend } from "../../personal-information/services/AddAndRemoveFriend";

const { TextArea } = Input;
const ShortItem = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const idParams = id;
  const currentId = localStorage.getItem("ID");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalComment, setIsModalComment] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [idLikes, setIdLikes] = useState("");
  const [dataPost, setDataPost] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [ower, setOwer] = useState({});
  const [likesCount, setLikesCount] = useState(0);
  const [likeData, setLikeData] = useState([]);
  const [isActiveModalShort, setIsActiveModalShort] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("you do you want to delete ?");
  const [openEdit, setOpenEdit] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [dotShort, setDotShort] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [UserCurren, setUserCurren] = useState([]);

  const callData = async () => {
    const postRef = doc(collection(db, "shortVideo"), id);
    const shortDoc = await getDoc(postRef);
    await onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setDataPost({
          id: doc.id,
          ...doc.data(),
          userId: doc.data().userId,
          createdAt: doc.data().createdAt.toDate(),
          timeElapsed: moment(doc.data().createdAt.toDate()).fromNow(),
        });
        setCurrentContent(doc.data().content);

        setDotShort(doc.data().userId !== currentId);
      } else {
        console.log("No such document!");
      }
    });
    await onSnapshot(doc(db, "users", shortDoc.data().userId), (doc) => {
      setOwer({
        ...doc.data(),
        id: doc.id,
      });
    });
    await onSnapshot(doc(db, "users", currentId), (doc) => {
      setUserCurren({
        ...doc.data(),
        id: doc.id,
      });
    });
  };
  const a = () => {
    const likesRef = collection(db, "likeShort");
    const q = query(likesRef, where("shortId", "==", id));
    onSnapshot(q, (querySnapshot) => {
      setLikeData(querySnapshot.docs.map((e) => e.id));
      setLikesCount(querySnapshot.size);
      const Userlike = querySnapshot.docs.find(
        (doc) => doc.data().userId === currentId
      );
      if (Userlike === undefined) {
        setIsHeartActive(false);
      } else {
        setIsHeartActive(true);
        setIdLikes(Userlike.id);
      }
    });
  };

  useEffect(() => {
    callData();
    setIsPlaying(true);
    a();
  }, [id]);
  useEffect(() => {
    const postsCol = collection(db, "commentShort");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    const unsubscribeee = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          content: doc.data().content,
          createdAt: doc.data().createdAt,
          ...doc.data(),
        }))
        .filter((doc) => doc.idShort === id);

      setCommentCount(data.length);
      setCommentData(data);
    });
    return unsubscribeee;
  }, [id]);

  const heartHandle = async () => {
    const likesRef = collection(db, "likeShort");
    const usersCol = collection(db, "notification");
    const q = query(
      usersCol,
      where("idpost", "==", id),
      where("status", "==", 5)
    );
    const querySnapshot = await getDocs(q);
    const postRefUser = doc(collection(db, "users"), currentId);
    const postDocUser = await getDoc(postRefUser);
    if (!isHeartActive) {
      addDoc(likesRef, {
        userId: currentId,
        shortId: id,
      }).then(() => {
        if (dataPost.userId !== currentId) {
          if (querySnapshot.size === 0) {
            addDoc(usersCol, {
              sender: currentId,
              receiver: [dataPost.userId],
              avatarUrl: postDocUser.data().avatarUrl,
              fullname: postDocUser.data().fullname,
              messageTo: ``,
              messageFrom:
                likesCount > 1
                  ? `${
                      postDocUser.data().fullname
                    } and ${likesCount} people liked  your short.`
                  : `${postDocUser.data().fullname} liked  your short`,
              createAt: serverTimestamp(),
              idpost: id,
              status: 5,
            });
          } else {
            querySnapshot.forEach((value) => {
              if (value.data().status === 5) {
                const frankDocRef = doc(db, "notification", value.id);
                updateDoc(frankDocRef, {
                  sender: currentId,
                  avatarUrl: postDocUser.data().avatarUrl,
                  userName: postDocUser.data().username,
                  fullname: postDocUser.data().fullname,
                  messageFrom:
                    likesCount > 0
                      ? `${
                          postDocUser.data().fullname
                        } and ${likesCount} people liked your short.`
                      : `${postDocUser.data().fullname} liked your short `,
                  createAt: serverTimestamp(),
                  status: 5,
                });
              }
            });
          }
        }
      });
    } else {
      deleteDoc(doc(db, "likeShort", idLikes));
    }
  };
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSound = () => {
    const video = videoRef.current;
    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
  };

  // hàm này dùng để tua hoặc kéo có thể sẽ sử dụng sau
  const handleSeek = (event) => {
    const video = videoRef.current;
    const targetTime = event.target.value;

    video.currentTime = targetTime;

    setCurrentTime(targetTime);
  };
  //
  const handleClose = (e) => {
    setIsModalComment(e);
  };
  const handleComment = () => {
    setIsModalComment(true);
  };

  const wrapperRef = useRef(null);
  useEffect(() => {
    // Lắng nghe sự kiện click để đóng editComment khi click ra ngoài
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActiveModalShort(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  const handleDeletePost = () => {
    setOpenDelete(true);
  };

  const handleOkDelete = async () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const shortNavigate = collection(db, "shortVideo");
      const q = query(shortNavigate, orderBy("createdAt", "desc"), limit(1));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
        }));
        navigate(`/short/${data[0].id}`);
      });
      const postRef = doc(collection(db, "shortVideo"), id);
      setOpenDelete(false);
      setConfirmLoading(false);
      likeData.map((e) => deleteDoc(doc(collection(db, "likeShort"), e)));

      commentData.map((e) =>
        deleteDoc(doc(collection(db, "commentShort"), e.id))
      );
      await deleteDoc(postRef);
    }, 1000);
  };
  const handleCancelDelete = () => {
    setOpenDelete(false);
  };
  const handleInputChange = (event) => {
    setCurrentContent(event.target.value);
  };
  const handleEditPost = () => {
    setOpenEdit(true);
  };
  const handleOkEdit = () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const postRef = doc(collection(db, "shortVideo"), id);
      const postDoc = await getDoc(postRef);
      await updateDoc(postRef, {
        ...postDoc.data(),
        content: currentContent,
      }); // Gọi hàm cập nhật bài viết
      setOpenEdit(false);
      setConfirmLoading(false);
    }, 1000);
  };
  const handleCancelEdit = () => {
    setOpenEdit(false);
  };
  const onAddFriend = () => {
    AddFriend(currentId, ower.id, messageApi, UserCurren, ower);
  };
  return (
    <>
      {contextHolder}
      <div className="shortItem">
        <div className="icon sound" onClick={handleSound}>
          <img
            src={isMuted ? icon_mute : icon_unMute}
            alt=""
            className=" iconSound"
          />
        </div>
        <div
          className={isPlaying ? "video-controls " : "video-controls active"}
          onClick={togglePlay}
        >
          <div className="pause">
            {!isPlaying && (
              <img src={icon_play} alt="" className=" icon_play" />
            )}
          </div>

          <div className="duaration">
            <div
              className="duaration1"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
        </div>
        <video
          ref={videoRef}
          src={dataPost.videoUrl}
          className="video"
          autoPlay
          loop
          onTimeUpdate={handleTimeUpdate}
        ></video>
        <div className="short-infomation">
          <div className="user-short">
            <Link to={`/Profile/${ower.id}`}>
              <img src={ower.avatarUrl} alt="" />
              <div>
                <h3>{ower.fullname}</h3>
                <span>
                  <img src={icon_clock} alt="" /> {dataPost.timeElapsed}
                </span>
              </div>
            </Link>
            {UserCurren.friend?.find((item) => item.id !== currentId) ? (
              ""
            ) : (
              <span onClick={onAddFriend}>&#x2022; Add friends</span>
            )}
          </div>
          <span className="short-bio">{dataPost.content}</span>
        </div>

        <footer className="between short-footer ">
          <div className="flex">
            <span className="short-like">
              <img
                onClick={heartHandle}
                className="icon"
                src={isHeartActive ? icon_heartActive : icon_heart}
                alt=""
              />
              <span>
                {likesCount > 1 ? `${likesCount} likes` : `${likesCount} like`}
              </span>
            </span>
            <span className="short-comment" onClick={handleComment}>
              <img className="icon" src={icon_comments} alt="" />
              <span>
                {commentCount > 1
                  ? `${commentCount} comments`
                  : `${commentCount} comment`}
              </span>
            </span>
          </div>
          {!dotShort && (
            <div
              className="short-edit"
              onClick={() => {
                setIsActiveModalShort(!isActiveModalShort);
              }}
            >
              {isActiveModalShort && (
                <ul className="modal-edit">
                  <li className=" " type="dashed">
                    <img
                      src={icon__trash}
                      alt=""
                      className="icon"
                      onClick={handleDeletePost}
                    />
                    <span onClick={handleDeletePost}>Delete</span>
                  </li>
                  <li className="" onClick={handleEditPost}>
                    <img src={icon__pencil} alt="" className="icon" />
                    <span>Edit</span>
                  </li>
                </ul>
              )}
              <img src={icon_edit} alt="" className="icon" />
            </div>
          )}
        </footer>
      </div>
      {isModalComment && (
        <ModalComment id={idParams} dataPost={dataPost} isClose={handleClose} />
      )}
      <Modal
        title="Delete this video"
        open={openDelete}
        onOk={handleOkDelete}
        confirmLoading={confirmLoading}
        onCancel={handleCancelDelete}
      >
        <p>{modalText}</p>
      </Modal>
      <Modal
        title="Edit post"
        open={openEdit}
        onOk={handleOkEdit}
        confirmLoading={confirmLoading}
        onCancel={handleCancelEdit}
      >
        <TextArea
          value={currentContent}
          onChange={handleInputChange}
          showCount
          maxLength={2500}
          autoSize={{ minRows: 2, maxRows: 7 }}
        />
      </Modal>
    </>
  );
};

export default ShortItem;
