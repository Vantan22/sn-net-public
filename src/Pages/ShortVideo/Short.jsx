import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "video.js/dist/video-js.min.css";
import { db } from "../../Api/firebase";
import icon_prev from "../../img/vuesax/linear/arrow-left.png";
import icon_next from "../../img/vuesax/linear/arrow-right.png";
import ModalCreateShort from "./Modal/ModalCreate/ModalCreateShort";
import "./Short.css";
const Short = () => {
  const navigate = useNavigate();
  const [dataPostAPI, setDataPostAPI] = useState([]);
  const [currentIdIndex, setCurrentIdIndex] = useState(0);
  const [nextActive, setNextActive] = useState(true);
  const [prevActive, setPrevActive] = useState(false);
  useEffect(() => {
    // lấy data từ sever về d
    const postsCol = collection(db, "shortVideo");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
      }));

      setDataPostAPI(data);
      if (data.length === 0) {
        setNextActive(false);
        setPrevActive(false);
      }
    });
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = (e) => {
    setIsModalOpen(e);
  };
  const handlePrev = () => {
    setNextActive(true);
    //
    if (currentIdIndex - 1 === 0) setPrevActive(false);
    if (currentIdIndex > 0) {
      setCurrentIdIndex(currentIdIndex - 1);
      navigate(`/short/${dataPostAPI[currentIdIndex - 1].id}`);
    } else {
      setCurrentIdIndex(currentIdIndex);
      navigate(`/short/${dataPostAPI[currentIdIndex].id}`);
    }
  };
  const handleNext = () => {
    setPrevActive(true);

    if (dataPostAPI.length === currentIdIndex + 2) setNextActive(false);
    if (dataPostAPI.length < currentIdIndex + 1) {
      setCurrentIdIndex(currentIdIndex);
      navigate(`/short/${dataPostAPI[currentIdIndex].id}`);
    }
    if (dataPostAPI.length > currentIdIndex + 1) {
      setCurrentIdIndex(currentIdIndex + 1);
      navigate(`/short/${dataPostAPI[currentIdIndex + 1].id}`);
    }
  };

  return (
    <>
      {isModalOpen && <ModalCreateShort isActive={handleModal} />}
      <div id="short">
        <header>
          <h1>Short</h1>
          <div
            className="add_icon"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            add
          </div>
        </header>
        <main className="short-content">
          {/* <ShortItem videoUrl={videoTest} /> */}
          <Outlet />
          <div className="nav-short">
            {prevActive && (
              <div className="prev" onClick={handlePrev}>
                <img
                  src={icon_prev}
                  style={{ height: "30px", width: "30px" }}
                  alt=""
                />
              </div>
            )}
            {nextActive && (
              <div className="next" onClick={handleNext}>
                <img
                  src={icon_next}
                  style={{ height: "30px", width: "30px" }}
                  alt=""
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Short;
