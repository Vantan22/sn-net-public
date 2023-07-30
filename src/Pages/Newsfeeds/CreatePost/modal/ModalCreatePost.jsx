import { message } from "antd";
import domtoimage from "dom-to-image";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext } from "react";
import { db, storage } from "../../../../Api/firebase";
import ImageField from "../../Components/ImageField";
import { FilterContext } from "../Createpost";
import FirstStep from "../Steps/FirstStep";
import SecondStep from "../Steps/SecondStep";
import ThridStep from "../Steps/ThridStep";
import "./ModalCreatePost.css";
const ModalCreatePost = () => {
  const {
    setinputData,
    setCurrent,
    inputData,
    imageFile,
    imgResultRef,
    setModalState,
    userData,
    curent,
    SetimageFile,
    currentId,
  } = useContext(FilterContext);
  const [messageApi, contextHolder] = message.useMessage();
  const PostData = (e) => {
    messageApi.open({
      key: "updatable",
      type: "loading",
      content: "Loading...",
    });
    e.preventDefault();
    domtoimage
      .toBlob(imgResultRef.current)
      .then(function (blob) {
        const imagePath = `images/${Math.floor(
          Math.random() * 1000000000
        )}.png`;
        const storageRef = ref(storage, imagePath);
        uploadBytes(storageRef, blob)
          .then(() => {
            // Lấy link download của ảnh từ Firebase Storage
            getDownloadURL(storageRef).then(async (url) => {
              const createPost = collection(db, "postItem");
              addDoc(createPost, {
                userId: currentId,
                authorAvatar: userData.avatarUrl,
                authorName: userData.fullname,
                content: inputData,
                image: url,
                createdAt: serverTimestamp(),
              }).then(async (docref) => {
                const usersCol = collection(db, "notification");
                let arr = [];
                const postRefUser = doc(collection(db, "users"), currentId);
                const postDocUser = await getDoc(postRefUser);
                const fiend = postDocUser
                  .data()
                  .friend.filter((item) => item.status === 1);
                fiend.map((value) => {
                  arr = [...arr, value.id];
                });
                addDoc(usersCol, {
                  sender: currentId,
                  receiver: arr,
                  avatarUrl: postDocUser.data().avatarUrl,
                  fullname: postDocUser.data().fullname,
                  messageTo: ``,
                  messageFrom: `Your friend:  ${
                    postDocUser.data().fullname
                  } created a new post`,
                  createAt: serverTimestamp(),
                  idpost: docref.id,
                  status: 3,
                });
              });
              setModalState(false);
              setinputData("");
              SetimageFile(null);
              setCurrent(0);
            });
          })
          .catch((error) => {
            console.error("Upload thất bại:", error);
          });
      })
      .catch(function (error) {
        console.error("ooops, something went wrong!", error);
      });
  };
  const handleNextStepone = () => {
    if (imageFile) {
      setCurrent(curent + 1);
    } else {
      messageApi.open({
        key: "updatable",
        type: "warning",
        content: "please choose image and try again!",
        duration: 3,
      });
    }
  };
  return (
    <>
      {contextHolder}
      <div className="Modal-CreatePost">
        <form onSubmit={PostData} className="Modal-CreatePost-wrapper">
          <div className="Modal-CreatePost-header">
            {curent === 0 ? (
              <div className="Modal-CreatePost-header-controls">
                <span
                  className="cuisor Modal-CreatePost-header-controls-left"
                  onClick={() => {
                    setModalState(false);
                    SetimageFile(null);
                  }}
                >
                  Close
                </span>
                <span className="Modal-CreatePost-header-controls-Content">
                  Choose Image
                </span>
                <span
                  className="cuisor Modal-CreatePost-header-controls-right"
                  onClick={handleNextStepone}
                >
                  Next
                </span>
              </div>
            ) : curent === 1 ? (
              <div className="Modal-CreatePost-header-controls">
                <span
                  className="cuisor Modal-CreatePost-header-controls-left"
                  onClick={() => {
                    setCurrent(curent - 1);
                  }}
                >
                  Previous
                </span>
                <span className="Modal-CreatePost-header-controls-Content">
                  Edit Image
                </span>
                <span
                  className="cuisor Modal-CreatePost-header-controls-right"
                  onClick={() => {
                    setCurrent(curent + 1);
                  }}
                >
                  Next
                </span>
              </div>
            ) : curent === 2 ? (
              <div className="Modal-CreatePost-header-controls">
                <span
                  className="cuisor Modal-CreatePost-header-controls-left"
                  onClick={() => {
                    setCurrent(curent - 1);
                  }}
                >
                  Previous
                </span>
                <span className="Modal-CreatePost-header-controls-Content">
                  Create new post
                </span>
                <button
                  type="submit"
                  className="cuisor Modal-CreatePost-header-controls-right btn"
                >
                  Share
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="Modal-CreatePost-Content">
            <ImageField step={curent} />
            {curent === 0 ? (
              <FirstStep />
            ) : curent === 1 ? (
              <SecondStep />
            ) : curent === 2 ? (
              <ThridStep userData={userData} />
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalCreatePost;
