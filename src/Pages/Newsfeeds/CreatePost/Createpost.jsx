import React, { createContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./CreatePost.css";
import ModalCreatePost from "./modal/ModalCreatePost";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../Api/firebase";
export const FilterContext = createContext();

const CreatePost = (props) => {
  const [modalState, setModalState] = useState(false);
  const currentId = localStorage.getItem("ID");
  const [curent, setCurrent] = useState(0);
  const [filterClass, SetFilterClass] = useState("");
  const [tab, setTab] = useState(0);
  const [userData, setUserData] = useState({});
  const [inputData, setinputData] = useState("");
  const [customFilter, setCustomFilter] = useState({
    contrast: 100,
    brightness: 100,
    saturate: 100,
    sepia: 0,
    grayscale: 0,
  });
  const [imageFile, SetimageFile] = useState(null);
  const imgResultRef = useRef(null);
  const handlePostModal = () => {
    setModalState(true);
  };

  const value = {
    setinputData,
    setCustomFilter,
    SetFilterClass,
    setTab,
    setCurrent,
    setModalState,
    SetimageFile,
    inputData,
    customFilter,
    filterClass,
    tab,
    imgResultRef,
    userData,
    curent,
    currentId,
    imageFile,
  };
    const getCurrentUser = async () => {
      const userRef = doc(collection(db, "users"), currentId);
      const userGet = await getDoc(userRef);
      const currenComment = userGet.data();
      setUserData(currenComment);
    };
  useEffect(() => {
    getCurrentUser()
  }, []);
  return (
    <>

      <FilterContext.Provider value={value}>
        {modalState && <ModalCreatePost show={modalState} />}

        <div className="create-post">
          <Link>
            <img src={props.avatar} alt="" />
          </Link>
          <span onClick={handlePostModal}>
            what do you think man.{props.userName}
          </span>
        </div>
      </FilterContext.Provider>
    </>
  );
};

export default CreatePost;
