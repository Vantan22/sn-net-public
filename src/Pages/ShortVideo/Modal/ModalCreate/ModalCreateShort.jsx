import React, { useEffect, useState } from "react";
import "./ModalCreateShort.css";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../../../Api/firebase";
import { Input } from "antd";
import { debounce } from "lodash";
import icon__trash from "../../../../img/trash/trash-alt.png";
import { useNavigate } from "react-router";

const { TextArea } = Input;
const ModalCreateShort = (props) => {
  const navigate = useNavigate();
  const currentId = localStorage.getItem("ID");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [dataOwer, setDataOwer] = useState({});
  const [postContent, setPostContent] = useState("");

  // const [fileInput,setFileInput] = useState(null)
  const getData = async () => {
    const postRef = doc(collection(db, "users"), currentId);
    const postDoc = await getDoc(postRef);
    setDataOwer(postDoc.data());
  };
  useEffect(() => {
    getData();
  }, []);

  // Hàm xử lý khi người dùng chọn file video
  const handleVideoInputChange = (event) => {
    const file = event.target.files[0];
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      if (video.duration > 60) {
        alert("Please select a video under 60 seconds");
      } else {
        setSelectedVideo(file);
      }
    };
  };

  // Hàm xử lý khi người dùng submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedVideo) {
      // alert("Vui lòng chọn file video");
      const file = selectedVideo; // file ảnh được chọn bởi người dùng
      // const storageRef = ;
      const imageRef = ref(storage, `video/${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      // Lấy URL của file ảnh sau khi upload thành công
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // setUrlPost(downloadURL);

            const createShort = collection(db, "shortVideo");

            addDoc(createShort, {
              userId: currentId,
              content: postContent,
              videoUrl: downloadURL,
              likes: [],
              comments: [],
              createdAt: serverTimestamp(),
            }).then(async (e) => {
              const usersCol = collection(db, "notification");
              let arr = [];
              const fiend = dataOwer.friend.filter((item) => item.status === 1);
              fiend.map((value) => {
                arr = [...arr, value.id];
              });
              addDoc(usersCol, {
                sender: currentId,
                receiver: arr,
                avatarUrl: dataOwer.avatarUrl,
                fullname: dataOwer.fullname,
                messageTo: ``,
                messageFrom: `Your friend:  ${dataOwer.fullname} created a new short`,
                createAt: serverTimestamp(),
                idpost: e.id,
                status: 7,
              });
              navigate("/short/" + e.id);
            });
          });
        }
      );
      props.isActive(false);
    } else {
      alert("Vui lòng chọn file video");
    }
  };

  const handleInputValue = debounce((e) => {
    setPostContent(e.target.value);
  }, 1000);
  const handleDeleteThisVideo = () => {
    setSelectedVideo(null);
  };
  return (
    <>
      <div className="Modal-create-post">
        <form onSubmit={handleSubmit}>
          <div className="Modal-create-post-wrapper">
            <div className="Modal-create-post-header">
              <span
                onClick={() => {
                  props.isActive(false);
                }}
              >
                Cancel
              </span>
              <div className="Modal-create-post-header-title">
                Create a Short
              </div>
              <button type="submit">Post</button>
            </div>
            <div className="Modal-create-post-content">
              <div className="Modal-create-post-content-input-video">
                {/* Input video */}

                {selectedVideo ? (
                  // Hiển thị video đã chọn
                  <div className="Modal-create-post-content-selected-video">
                    <video
                      src={URL.createObjectURL(selectedVideo)}
                      controls
                      className="video-input"
                      autoPlay
                    />
                  </div>
                ) : (
                  <label className="input-label" htmlFor="inputImages">
                    <span className="input-label-text">Choose Video</span>
                    <input
                      id="inputImages"
                      type="file"
                      name="video"
                      accept="video/*"
                      capture
                      onChange={handleVideoInputChange}
                    />
                  </label>
                )}
              </div>
              <div className="Modal-create-post-content-input-content">
                {/* Các trường thông tin khác (nếu có) */}
                <div className="modal-create-post-content-addinfo">
                  <div className="user_create">
                    <img
                      src={dataOwer === undefined ? "" : dataOwer.avatarUrl}
                      alt=""
                    />
                    <span className="user_create-name">
                      {dataOwer === undefined
                        ? ""
                        : dataOwer.fullname}
                    </span>
                  </div>
                  <div className="user_input">
                    <TextArea
                      className="user_input__input"
                      placeholder="Write a caption ..."
                      autoSize={{
                        minRows: 2,
                        maxRows: 6,
                      }}
                      maxLength="2500"
                      bordered={false}
                      showCount
                      onChange={handleInputValue}
                    />
                  </div>
                </div>
                {selectedVideo && (
                  <div
                    className="icon-delete-video"
                    title="Delete this video"
                    onClick={handleDeleteThisVideo}
                  >
                    <img src={icon__trash} alt="" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalCreateShort;
