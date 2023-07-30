import { Input } from "antd";
import {
  addDoc,
  collection,
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
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../../Api/firebase";
import icon_close from "../../../../img/close/close.png";
import CommentItems from "./CommentItems";
import "./ModalComment.css";
const { TextArea } = Input;

const ModalComment = ({ id, isClose, dataPost }) => {
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [ower, setOwer] = useState({});
  const currentId = localStorage.getItem("ID");
  const [commentContent, setCommentContent] = useState("");
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const unsubscribee = onSnapshot(doc(db, "users", currentId), (doc) => {
      setOwer(doc.data());
    });

    const postsCol = collection(db, "commentShort");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    const unsubscribeee = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        createdAt: doc.data().createdAt,
        ...doc.data(),
      }));
      const datafilter = data.filter((doc) => doc.idShort === id);
      setComments(datafilter);
      setCommentCount(datafilter.length);
    });

    return unsubscribee, unsubscribeee;
  }, []);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleCancel = () => {
    setCommentContent("");
    setFocused(false);
  };
  const handleBlur = (event) => {
    if (!commentContent) {
      setFocused(false);
    }
  };
  const sendComment = async (e) => {
    e.preventDefault();

    const createComments = collection(db, "commentShort");
    const usersCol = collection(db, "notification");
    const q = query(
      usersCol,
      where("idpost", "==", id),
      where("status", "==", 6)
    );
    const postRefUser = doc(collection(db, "users"), currentId);
    const postDocUser = await getDoc(postRefUser);
    const querySnapshot = await getDocs(q);
    if (commentContent !== "") {
      addDoc(createComments, {
        idShort: id,
        content: commentContent,
        userId: currentId,
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
              commentCount > 1
                  ? `${
                      postDocUser.data().fullname
                    } just commented on your post and you have ${commentCount} other comments.`
                  : `${postDocUser.data().fullname} commented your post`,
              createAt: serverTimestamp(),
              idpost: id,
              status: 6,
            });
          } else {
            querySnapshot.forEach((value) => {
              if (value.data().status === 6) {
                const frankDocRef = doc(db, "notification", value.id);
                updateDoc(frankDocRef, {
                  sender: currentId,
                  avatarUrl: postDocUser.data().avatarUrl,
                  userName: postDocUser.data().username,
                  fullname: postDocUser.data().fullname,
                  messageFrom:
                  commentCount > 0
                      ? `${
                          postDocUser.data().fullname
                        } just commented on your post and you have ${commentCount} other comments.`
                      : `${postDocUser.data().fullname} commented your post `,
                  createAt: serverTimestamp(),
                  status: 6,
                });
              }
            });
          }
        }
      });
    }
    setCommentContent("");
    setFocused(false);
  };
  const inputRef = useRef(null);

  // useEffect(() => {
  //   if (isEditContent && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [isEditContent]);

  const ulRef = useRef(null);

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTo(0, 0);
    }
  }, [comments]);

  return (
    <div className="Modal-Comment">
      <div className="Modal-Comment-wrapper">
        <header className="Modal-Comment-header">
          <div className="Modal-Comment-header-title">
            <h2>Comments</h2>
            <span>{commentCount}</span>
          </div>
          <img
            src={icon_close}
            alt=""
            className="icon icon-close-comment"
            onClick={() => {
              isClose(false);
            }}
          />
        </header>
        <div className="Modal-Comment-content">
          <form
            onSubmit={sendComment}
            className="Modal-Comment-content-owner-comment"
          >
            <div className="Modal-Comment-content-owner-comment-info">
              <img className="avatar-owner" src={ower.avatarUrl} alt="" />
              <div
                className={
                  focused ? "input-owner-comment focus" : "input-owner-comment"
                }
              >
                <TextArea
                  placeholder="Write comment ..."
                  autoSize={{
                    minRows: 1,
                    maxRows: 3,
                  }}
                  bordered={false}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                  }}
                  value={commentContent}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onPressEnter={sendComment}
                  ref={inputRef}
                />
              </div>
            </div>
            {focused && (
              <div className="Modal-Comment-content-owner-comment-controls">
                <div
                  className="Modal-Comment-controls  Modal-Comment-content-owner-comment-controls-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </div>
                <button
                  type="submit"
                  className="Modal-Comment-controls  Modal-Comment-content-owner-comment-controls-comment"
                >
                  Comment
                </button>
              </div>
            )}
          </form>
          <div className="Modal-Comment-content-Items" ref={ulRef}>
            {comments.map((value, index) => (
              <CommentItems key={index} id={id} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComment;
