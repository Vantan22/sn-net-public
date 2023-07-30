import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { createContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { db, storage } from "../../../Api/firebase";

import { Input, Modal } from "antd";
import icon_pencel from "../../../img/PostPersonalInformation/vuesax/linear/setting-2.png";
import icon_delete from "../../../img/editpost/close-square.png";
import icon_edit from "../../../img/editpost/edit-05.png";
import icon__heart from "../../../img/heart.svg";
import icon__heartActive from "../../../img/heartabcd.svg";
import icon__comments from "../../../img/messagecomments.svg";
import icon__clock from "../../../img/vuesax/linear/clock.png";
import "./Posts.css";

const { TextArea } = Input;
export const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="postItem-desc">
      {isReadMore ? text.slice(0, 140) : text}

      {text.length < 100 ? (
        <a></a>
      ) : (
        <span onClick={toggleReadMore} className="cuisor readmore">
          {isReadMore ? "  ...read more" : " show less"}
        </span>
      )}
    </p>
  );
};
export const PostData = createContext();
const Posts = ({ data }) => {
  const currentId = localStorage.getItem("ID");
  const [dataPost, setDataPost] = useState(data);
  const [dataPostAPI, setDataPostAPI] = useState([]);
  const navigate = useNavigate();
  const [isViewPost, setViewPost] = useState(false);
  const [heartActive, setHeartActive] = useState(false);
  const [idLikes, setIdLikes] = useState("");

  const [likesCount, setLikesCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [currentContent, setCurrentContent] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [modalText, setModalText] = useState("you do you want to delete ?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [defaultImg, setDefaultImg] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const toggleViewPost = () => {
    setViewPost(!isViewPost);
    navigate(`/${data.id}`);
  };

  // Call data lần đầu tiên
  useEffect(() => {
    const getPostIem = onSnapshot(doc(db, "postItem", data.id), (doc) => {
      if (doc.exists) {
        setDefaultImg(doc.data()?.image);
        setDataPostAPI({
          id: doc.id,
          ...doc.data(),
        });
      } else {
        console.log("No such document!");
      }
    });
    const likesRef = collection(db, "likePost");
    const q = query(likesRef, where("postId", "==", data.id));
    const getlikes = onSnapshot(q, (querySnapshot) => {
      setLikesCount(querySnapshot.size);
      const Userlike = querySnapshot.docs.find(
        (doc) => doc.data().userId === currentId
      );
      if (Userlike === undefined) {
        setHeartActive(false);
      } else {
        setHeartActive(true);
        setIdLikes(Userlike.id);
      }
    });
    const commentRef = collection(db, "commentPost");
    const queryComment = query(commentRef, where("postId", "==", data.id));
    const getComments = onSnapshot(queryComment, (querySnapshot) => {
      setCommentCount(querySnapshot.size);
    });

    return getPostIem, getlikes, getComments;
  }, []);

  const heartHandler = async () => {
    // get data post
    const likesRef = collection(db, "likePost");
    const postRef = doc(collection(db, "postItem"), dataPostAPI.id);
    const postDoc = await getDoc(postRef);
    // get data User
    const postRefUser = doc(collection(db, "users"), currentId);
    const postDocUser = await getDoc(postRefUser);
    // get data notification
    const usersCol = collection(db, "notification");

    // xử lí khi chưa like
    if (heartActive === false) {
      const q = query(
        usersCol,
        where("idpost", "==", dataPostAPI.id),
        where("status", "==", 1)
      );
      const querySnapshot = await getDocs(q);
      addDoc(likesRef, {
        userId: currentId,
        postId: dataPostAPI.id,
      }).then(() => {
        if (postDoc.data().userId !== currentId) {
          if (querySnapshot.size === 0) {
            addDoc(usersCol, {
              sender: currentId,
              receiver: [postDoc.data().userId],
              avatarUrl: postDocUser.data().avatarUrl,
              userName: postDocUser.data().username,
              fullname: postDocUser.data().fullname,
              messageTo: ``,
              messageFrom:
                likesCount > 1
                  ? `${
                      postDocUser.data().fullname
                    } and ${likesCount} people liked your post.`
                  : `${postDocUser.data().fullname} liked your post`,
              createAt: serverTimestamp(),
              idpost: dataPostAPI.id,
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
        }
      });
    } else {
      deleteDoc(doc(db, "likePost", idLikes));
    }
  };
  const handleInputChange = (event) => {
    setCurrentContent(event.target.value);
  };
  const handleEditPost = async () => {
    const postRef = doc(collection(db, "postItem"), data.id);
    const postDoc = await getDoc(postRef);
    setCurrentContent(postDoc.data().content);
    setOpenEdit(true);
    setDefaultImg(postDoc.data().image);
  };
  const handleOkEdit = () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const postRef = doc(collection(db, "postItem"), dataPost.id);
      const postDoc = await getDoc(postRef);
      await updateDoc(postRef, {
        ...postDoc.data(),
        content: currentContent,
        // image: imgChange,
      }); // Gọi hàm cập nhật bài viết
      setOpenEdit(false);
      setConfirmLoading(false);
    }, 1500);
    // Chọn file người dùng chọn
    const userRef = doc(collection(db, "postItem"), dataPost.id);
    const file = selectedImg;
    if (file !== null) {
      const imgRef = ref(storage, `image/${file.name}`);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // setImgChange(downloadURL)
            updateDoc(userRef, {
              image: downloadURL,
            });
          });
        }
      );
    } else {
      // setImgChange(defaultImg);
    }
  };
  const handleCancelEdit = () => {
    setOpenEdit(false);
  };
  const handleDeletePost = () => {
    setOpenDelete(true);
  };
  const handleOkDelete = () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const postRef = doc(collection(db, "postItem"), dataPost.id);
      setOpenDelete(false);
      setConfirmLoading(false);
      await deleteDoc(postRef);
    }, 2000);
  };
  const handleCancelDelete = () => {
    setOpenDelete(false);
  };

  // Hàm xử lí khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImg(file);
    setDefaultImg(URL.createObjectURL(file));
  };
  const PostDataContext = {
    dataPost,
    dataPostAPI,
    likesCount,
    commentCount,
    heartActive,
  };
  return (
    <>
      <PostData.Provider value={PostDataContext}>
        {<Outlet />}
        <div className="postItem">
          <header className="postItem-header">
            <div onClick={()=> {navigate(`/Profile/${data.userId}`)}}>
              <Link>
                <img
                  src={data.authorAvatar}
                  className="postItem-header__imageUser"
                  alt=""
                />
              </Link>
              <Link>
                <div className="postItem-User-tittle">
                  <span className="userName-postItem">{data.authorName}</span>
                  <span className="userName-postItem-times">
                    <img src={icon__clock} alt="" />
                    {data.timeElapsed}
                  </span>
                </div>
              </Link>
            </div>
            <div>
              {dataPost.userId == currentId ? (
                <>
                  <div>
                    <img
                      src={icon_edit}
                      alt=""
                      onClick={handleEditPost}
                      className="iconEdit"
                    />
                    <Modal
                      title="Edit post"
                      open={openEdit}
                      onOk={handleOkEdit}
                      confirmLoading={confirmLoading}
                      onCancel={handleCancelEdit}
                      className="modal-editPost"
                      wrapClassName="wrapModal-editPost"
                    >
                      <div className="wrap-modalEdit-postImg">
                        <img
                          src={defaultImg}
                          alt=""
                          className="modalEdit-currentImgPost"
                        />

                        <label htmlFor="input-img-post">
                          <input
                            type="file"
                            id="input-img-post"
                            onChange={handleImageChange}
                          />
                          <div className="btn-changeImg">
                            <img
                              src={icon_pencel}
                              alt=""
                              className="pencel-change-img"
                            />
                          </div>
                        </label>
                      </div>
                      <div className="wrap-modalEdit-postText">
                        <div className="user-edit-post">
                          <img src={data.authorAvatar} alt="" />
                          <span className="user-editPostName">
                            {data.authorName}
                          </span>
                        </div>
                        <TextArea
                          value={currentContent}
                          onChange={handleInputChange}
                          showCount
                          maxLength={2500}
                          autoSize={{ minRows: 2, maxRows: 7 }}
                        />
                      </div>
                    </Modal>
                  </div>

                  <div>
                    <img
                      src={icon_delete}
                      onClick={handleDeletePost}
                      alt=""
                      className="iconDelete"
                    />
                    <Modal
                      title="Delete post"
                      open={openDelete}
                      onOk={handleOkDelete}
                      confirmLoading={confirmLoading}
                      onCancel={handleCancelDelete}
                    >
                      <p>{modalText}</p>
                    </Modal>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </header>
          <main className="postItem-content">
            <ReadMore>{data.content}</ReadMore>
            {/* modal posts */}
            <img
              onClick={toggleViewPost}
              src={data.image}
              alt=""
              className="postItem-content-img"
            />
          </main>
          <footer className="postItem-footer">
            <div className="wrapper-likes-comment">
              <div className="likes">
                <img
                  className="icon"
                  onClick={heartHandler}
                  src={heartActive ? icon__heartActive : icon__heart}
                />
                <span>
                  {likesCount < 2
                    ? `${likesCount} like`
                    : `${likesCount} likes`}
                </span>
              </div>
              <div onClick={toggleViewPost} className="comments">
                <img className="icon" src={icon__comments} alt="" />
                <span>{`${commentCount} Comments`}</span>
              </div>
            </div>
            {/* <hr /> */}
            <form onSubmit={toggleViewPost} className=""></form>
          </footer>
        </div>
      </PostData.Provider>
    </>
  );
};

export default Posts;
