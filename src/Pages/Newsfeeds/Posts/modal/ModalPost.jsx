import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import icon__heart from "../../../../img/heart.svg";
import icon__heartActive from "../../../../img/heartabcd.svg";
import icon__comments from "../../../../img/messagecomments.svg";
import icon_Close from "../../../../img/trash/close.png";
import icon_Clock from "../../../../img/vuesax/linear/clock2.svg";
import "../../Posts/modal/ModalPost.css";

import UserCommentPost from "./UserCommentPost";

import { message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { db } from "../../../../Api/firebase";
import { AddFriend } from "../../../personal-information/services/AddAndRemoveFriend";

const ModalPost = ({ linkTo }) => {
  const navigate = useNavigate();
  const { idPost } = useParams();
  const currentId = localStorage.getItem("ID");
  const [inputActive, setinputActive] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [idLikes, setIdLikes] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [users, setUsers] = useState([]);

  const [friend, setFriend] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  //Like bài Post
  //Set trạng thái like và unlike bài post
  const heart = () => {
    const likesRef = collection(db, "likePost");
    const q = query(likesRef, where("postId", "==", idPost));
    onSnapshot(q, (querySnapshot) => {
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
    heart();
  }, [idPost]);
  const heartHandle = async () => {
    const likesRef = collection(db, "likePost");
    const usersCol = collection(db, "notification");
    const q = query(
      usersCol,
      where("idpost", "==", idPost),
      where("status", "==", 1)
    );
    const querySnapshot = await getDocs(q);
    const postRefUser = doc(collection(db, "users"), currentId);
    const postDocUser = await getDoc(postRefUser);
    if (!isHeartActive) {
      addDoc(likesRef, {
        userId: currentId,
        postId: idPost,
      }).then(() => {
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
                  } and ${likesCount} people liked  your post.`
                : `${postDocUser.data().fullname} liked  your post`,
            createAt: serverTimestamp(),
            idpost: idPost,
            status: 1,
          });
        } else {
          querySnapshot.forEach((value) => {
            if (value.data().status === 1) {
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
                      } and ${likesCount} people liked your post.`
                    : `${postDocUser.data().fullname} liked your post `,
                createAt: serverTimestamp(),
                status: 1,
              });
            }
          });
        }
      });
    } else {
      deleteDoc(doc(db, "likePost", idLikes));
    }
  };

  useEffect(() => {
    const getusers = async () => {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };
    const getDataOwner = onSnapshot(doc(db, "users", currentId), (doc) => {
      setCurrentUser(doc.data());
    });
    const setDataPostItem = onSnapshot(doc(db, "postItem", idPost), (doc) => {
      setDataPost(doc.data());
    });

    const postsColl = collection(db, "commentPost");
    const q = query(postsColl, orderBy("createdAt", "desc"));
    const unsubscribeee = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        createdAt: doc.data().createdAt,
        ...doc.data(),
      }));
      const datafilter = data.filter((doc) => doc.postId === idPost);
      setComments(datafilter);
      setCommentsCount(datafilter.length);
    });

    return setDataPostItem, getDataOwner, unsubscribeee, getusers;
  }, []);

  // hàm bắt sự kiện ấn ra ngoài modal
  function useOutsideAlerter(ref, handleOutSideClick) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleOutSideClick(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  //Hàm bắt sự kiện khi ấn enter trên bàn phím
  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  const inputRef = useRef(null);
  useOutsideAlerter(inputRef, setinputActive);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({ mode: "all" });

  async function onSubmit(values) {
    const createComments = collection(db, "commentPost");
    const usersCol = collection(db, "notification");
    const q = query(
      usersCol,
      where("idpost", "==", idPost),
      where("status", "==", 2)
    );
    const postRefUser = doc(collection(db, "users"), currentId);
    const postDocUser = await getDoc(postRefUser);
    const querySnapshot = await getDocs(q);
    if (commentContent !== "") {
      addDoc(createComments, {
        postId: idPost,
        content: commentContent,
        userID: currentId,
        createdAt: serverTimestamp(),
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
                commentsCount > 1
                  ? `${
                      postDocUser.data().fullname
                    } just commented on your post and you have ${commentsCount} other comments.`
                  : `${postDocUser.data().fullname} commented your post`,
              createAt: serverTimestamp(),
              idpost: idPost,
              status: 2,
            });
          } else {
            querySnapshot.forEach((value) => {
              if (value.data().status === 2) {
                const frankDocRef = doc(db, "notification", value.id);
                updateDoc(frankDocRef, {
                  sender: currentId,
                  avatarUrl: postDocUser.data().avatarUrl,
                  userName: postDocUser.data().username,
                  fullname: postDocUser.data().fullname,
                  messageFrom:
                    commentsCount > 0
                      ? `${
                          postDocUser.data().fullname
                        } just commented on your post and you have ${commentsCount} other comments.`
                      : `${postDocUser.data().fullname} commented your post `,
                  createAt: serverTimestamp(),
                  status: 2,
                });
              }
            });
          }
        }
      });
    }
    setCommentContent("");
  }

  const handleCloseModalPost = (e) => {
    e.stopPropagation(); // ngăn chặn sự kiện click xuyên qua modal

    navigate(-1);
  };

  const handleClickInsideModal = (e) => {
    e.stopPropagation(); // ngăn chặn sự kiện click xuyên qua modal
  };
  useEffect(() => {
    CheckFriend();
  }, [dataPost]);
  const CheckFriend = () => {
    if (dataPost.userId !== currentId) {
      setFriend(true);
    } else {
      setFriend(false);
    }
  };
  const user = users.find((user) => user.id === dataPost.userId);
  const find = currentUser.friend?.find(
    (value) => value.id === dataPost.userId
  );

  const onAddFriend = async () => {
    AddFriend(currentId, dataPost.userId, messageApi, currentUser, user);
  };
  return (
    <div className="wrap-modal-viewPost" onClick={handleCloseModalPost}>
      <img
        src={icon_Close}
        alt=""
        className="close-modal-post"
        onClick={handleCloseModalPost}
      />
      <div onClick={handleClickInsideModal} className="modal-viewPost">
        <img src={dataPost?.image} alt="" className="img-viewPost" />
        <div className="content-viewPost">
          <div className="wrap-contentViewPost">
            <div className="userPost">
              <div className="wrap-userPost">
                <Link>
                  <img
                    src={dataPost?.authorAvatar}
                    alt=""
                    className="userPostImg"
                  />
                </Link>

                <div className="about-userPost">
                  <div className="text-userPost">
                    <Link to="/">
                      <span className="userNamePost">
                        {dataPost?.authorName}
                      </span>
                    </Link>
                    {friend ? (
                      !find ? (
                        <div className="flex-center">
                          <span className="dot-userPost"></span>
                          <span
                            className="addFriend-userPost"
                            onClick={onAddFriend}
                          >
                            Add Friend
                          </span>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="time-userPosrt">
                    <img
                      src={icon_Clock}
                      alt=""
                      className="iconTime-userPost"
                    />
                    <span className="text-time-userPost">30 phút trước</span>
                  </div>
                </div>
              </div>
              <span className="userCapsitionPost">
                {isReadMore
                  ? dataPost?.content?.slice(0, 75)
                  : dataPost?.content}
                {dataPost?.content?.length < 100 ? (
                  <a></a>
                ) : (
                  <span onClick={toggleReadMore} className="cuisor readmore">
                    {isReadMore ? "  ...read more" : " show less"}
                  </span>
                )}
              </span>
            </div>
            <hr className="line-viewPost2"></hr>

            <div className="litsUser-Comment">
              {comments.map((value, index) => (
                <UserCommentPost key={index} id={idPost} value={value} />
              ))}
            </div>
          </div>

          <div className="bottom-viewPost">
            <hr className="line-viewPost3"></hr>
            <div className="infor-viewPost">
              <div className="viewPost-like">
                <img
                  className="icon"
                  onClick={heartHandle}
                  src={isHeartActive ? icon__heartActive : icon__heart}
                />
                <span>
                  {likesCount < 2
                    ? `${likesCount} like`
                    : `${likesCount} likes`}
                </span>
              </div>
              <div className="viewPost-comment">
                <img className="icon" src={icon__comments} alt="" />
                <span>
                  {commentsCount < 2
                    ? `${commentsCount} Comment`
                    : `${commentsCount} Comments`}
                </span>
              </div>
            </div>
            <div className="add-commentPost">
              <div className="userCommentPost">
                <img
                  src={currentUser?.avatarUrl}
                  alt=""
                  className="userCommentPostImg"
                />
              </div>
              <div className="comment-viewPost">
                <form
                  className="comment-input"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <textarea
                    type="text"
                    className="inputComment"
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Add a comment"
                    ref={inputRef}
                    rows={3}
                    {...register("textComment")}
                    cols={1}
                    value={commentContent}
                    onChange={(e) => {
                      setCommentContent(e.target.value);
                    }}
                  />
                  <button className="btn-commentPost">Post</button>
                </form>

                <div
                  className={inputActive ? "line-commentAtive" : "line-comment"}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPost;
