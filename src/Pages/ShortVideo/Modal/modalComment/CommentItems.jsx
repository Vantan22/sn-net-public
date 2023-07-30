import { Input } from "antd";
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../../Api/firebase";
import icon_close from "../../../../img/edit-icon//close.png";
import icon_check from "../../../../img/edit-icon/check-single.png";
import icon_edit from "../../../../img/edit-icon/edit-01.png";
import icon_trash from "../../../../img/edit-icon/vuesax/linear/trash.png";
import "./CommentItems.css";

const currentId = localStorage.getItem("ID");
const { TextArea } = Input;
const CommentItems = ({ value, id }) => {
  const [content, setContent] = useState(value.content);
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const wrapperRef = useRef(null);
  const [ower, setOwer] = useState({});
  const [editComment, setEditComment] = useState(false);
  const [isEditContent, setIsEditContent] = useState(false);
  // const [commentContent, setCommentContent] = useState({});
  const timeElapsed = moment(value.createdAt?.toDate()).fromNow();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", value.userId), (doc) => {
      setOwer({
        id: doc.id,
        fullname: doc.data().fullname,
        avatarUrl: doc.data().avatarUrl,
      });
    });
    setContent(value.content);
    return unsubscribe;
  }, [value.content]);

  useEffect(() => {
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
    await deleteDoc(doc(db, "commentShort", value.id));
    setEditComment(false);
  };

  const handleInputChange = (event) => {
    // setEditableText(event.target.innerText);
    setContent(event.target.value);
  };

  const handleSubmitNewComment = async () => {
    const postRef = doc(collection(db, "commentShort"), value.id);
    const postDoc = await getDoc(postRef);

    await updateDoc(postRef, {
      ...postDoc.data(),
      content: content,
    }); // Gọi hàm cập nhật bài viết

    setIsEditContent(false);
  };
  const handleCancelEditComment = () => {
    setIsEditContent(false);
    setContent(value.content);
  };
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditContent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditContent]);
  return (
    <div className="flex CommentItems">
      <>
        <div className="flex">
          <img
            src={ower.avatarUrl}
            alt=""
            className="CommentItems-avatarUser"
          />
          <div className="CommentItems-ower-content">
            <div className="flex betweenname">
              <div className="flex CommentItems-ower-content-top">
                <Link
                  to={`/Profile/${value.userId}`}
                  className="CommentItems-ower-content-top-name"
                >
                  {ower.fullname}
                </Link>
                {!isEditContent && (
                  <div className="CommentItems-ower-content-top-createAt">
                    {timeElapsed}
                  </div>
                )}
              </div>
              {isEditContent && (
                <div className="flex edit-comment-controls">
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
            <div className="CommentItems-ower-content-bottom">
              <span className="CommentItems-ower-content-bottom-content-comment">
                {isEditContent ? (
                  <TextArea
                    ref={inputRef}
                    placeholder="write comment"
                    autoSize={{
                      minRows: 1,
                      maxRows: 10,
                    }}
                    className="inputvalue"
                    bordered={false}
                    value={content}
                    onChange={handleInputChange}
                    // onPressEnter={handleSubmitNewComment}
                  />
                ) : (
                  <span>
                    {isReadMore ? content.slice(0, 75) : content}
                    {content.length < 100 ? (
                      <a></a>
                    ) : (
                      <span
                        onClick={toggleReadMore}
                        className="cuisor readmore"
                      >
                        {isReadMore ? "  ...read more" : " show less"}
                      </span>
                    )}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </>
      {!isEditContent && (
        <div className="wrapper" ref={wrapperRef}>
          {value.userId === currentId && (<span
            className="dot_more"
            onClick={() => {
              setEditComment(true);
            }}
          >
            &#9679;&#9679;&#9679;
          </span>)}

          {editComment && (
            <ul className="EditComments">
              <li onClick={handleEditComment}>
                <img className="iconComment" src={icon_edit} /> Edit comment
              </li>
              <li onClick={handleRemoveComment}>
                <img className="iconComment" src={icon_trash} /> Delete Comments
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItems;
