import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import icon_close from "../../../../img/edit-icon//close.png";
import icon_check from "../../../../img/edit-icon/check-single.png";
import icon_edit from "../../../../img/edit-icon/edit-01.png";
import icon_trash from "../../../../img/edit-icon/vuesax/linear/trash.png";
import icon_Clock from "../../../../img/vuesax/linear/clock2.svg";
import "./UserCommentPost.css";
// import { ReadMore } from '../PostItem';
import { Input, message } from "antd";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { db } from "../../../../Api/firebase";
import { AddFriend } from "../../../personal-information/services/AddAndRemoveFriend";

//Hàm get data user Comment post
const UserComment = (value, id) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [content, setContent] = useState(value.value.content);
  const [user, setUser] = useState({});
  const [editComment, setEditComment] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  const [isReadMore, setIsReadMore] = useState(true);
  const { TextArea } = Input;
  const userId = value.value.userID;
  const currentId = localStorage.getItem("ID");
  const [friend, setFriend] = useState(false);
  const [UserCurren, setUserCurren] = useState([]);

  // const timeElapsed = moment(value.createdAt?.toDate()).fromNow();

  const timeElapsed = moment(value.value.createdAt?.toDate()).fromNow();
  const wrapperRef = useRef(null);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  useEffect(() => {
    setContent(value.value.content);

    const unsubscribe = onSnapshot(
      doc(db, "users", value.value.userID),
      (doc) => {
        setUser({
          id: doc.id,
          ...doc.data(),
        });
      }
    );
    const getcurrentUser = onSnapshot(doc(db, "users", currentId), (doc) => {
      setUserCurren(doc.data());
    });
    CheckFriend();
    return unsubscribe, getcurrentUser;
  }, [value]);

  useEffect(() => {
    // Lắng nghe sự kiện click để đóng editComment khi click ra ngoài
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setEditComment(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  const handleEditComment = async () => {
    setIsEditContent(true);
    setEditComment(false);
  };
  const handleRemoveComment = async () => {
    await deleteDoc(doc(db, "commentPost", value.value.id));
    setEditComment(false);
  };
  const handleInputChange = (event) => {
    setContent(event.target.value);
  };
  const handleSubmitNewComment = async () => {
    const postRef = doc(collection(db, "commentPost"), value.value.id);
    const postDoc = await getDoc(postRef);

    await updateDoc(postRef, {
      ...postDoc.data(),
      content: content,
    }); // Gọi hàm cập nhật bài viết

    setIsEditContent(false);
  };
  const handleCancelEditComment = () => {
    setIsEditContent(false);
  };
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditContent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditContent]);
  const CheckFriend = () => {
    if (value.value.userID !== currentId) {
      setFriend(true);
    } else {
      setFriend(false);
    }
  };
  const find = UserCurren.friend?.find((value) => value.id === userId);
  const onAddFriend = async () => {
    AddFriend(currentId, userId, messageApi, UserCurren, user);
  };
  return (
    <div className="flex CommentItem">
      <>
        {contextHolder}
        <div className="flex CommentItem-users">
          <div className="CommentItem-user-infor">
            <img
              src={user.avatarUrl}
              alt=""
              className="CommentItem-avatarUser"
            />
            <div className="CommentItem-user-content">
              <div className="flex CommentItem-user-content-col">
                <div className="flex CommentItem-user-content-top">
                  <div className="container-CommentItem-user-content">
                    <Link
                      to={`/Profile/${value.value.userID}`}
                      className="CommentItems-user-content-top-name"
                    >
                      {user.fullname}
                    </Link>
                    {friend ? (
                      !find ? (
                        <div className="flex-center">
                          <span className="CommentItem-user-dot"></span>
                          <span
                            className="CommentItem-user-addFriend"
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
                  {!isEditContent && (
                    <div className="CommentItems-user-content-top-createAt">
                      <img
                        src={icon_Clock}
                        alt=""
                        className="CommentItems-user-content-top-createAt-icon"
                      />
                      <span className="CommentItems-user-content-top-createAt-text">
                        {timeElapsed}
                      </span>
                    </div>
                  )}
                </div>
                {isEditContent && (
                  <div className="flex edit-comment-control">
                    <img
                      src={icon_check}
                      alt=""
                      className="iconEditcomment"
                      onClick={handleSubmitNewComment}
                    />
                    <img
                      src={icon_close}
                      alt=""
                      className="iconEditcomment"
                      onClick={handleCancelEditComment}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="CommentItems-user-content-bottom">
            <span className="CommentItems-user-content-bottom-content-comment">
              {isEditContent ? (
                <TextArea
                  ref={inputRef}
                  placeholder="write comment"
                  autoSize={{
                    minRows: 1,
                    maxRows: 10,
                  }}
                  maxLength={2500}
                  className="inputvaluePost"
                  bordered={false}
                  value={content}
                  onChange={handleInputChange}
                  // onPressEnter={handleSubmitNewComment}
                />
              ) : (
                <span>
                  {isReadMore ? content?.slice(0, 75) : content}
                  {content?.length < 100 ? (
                    <a></a>
                  ) : (
                    <span onClick={toggleReadMore} className="cuisor readmore">
                      {isReadMore ? "  ...read more" : " show less"}
                    </span>
                  )}
                </span>
              )}
            </span>
          </div>
        </div>
      </>
      {value?.value.userID === currentId && (
        <div className="wrapper" ref={wrapperRef}>
          <span
            className="dot_mores"
            onClick={() => {
              setEditComment(true);
            }}
          >
            &#9679;&#9679;&#9679;
          </span>
          {editComment && (
            <ul className="EditCommentsPost">
              <li onClick={handleEditComment}>
                <img className="iconCommentPost" src={icon_edit} /> Edit comment
              </li>
              <li onClick={handleRemoveComment}>
                <img className="iconCommentPost" src={icon_trash} /> Delete
                Comments
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserComment;
