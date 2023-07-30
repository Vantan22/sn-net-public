import React, { useEffect, useRef, useState } from "react";
import { db } from "../../Api/firebase";

import { Link, useNavigate, useParams } from "react-router-dom";

import { Modal } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import moment from "moment";

const Chatbox = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentID = localStorage.getItem("ID");
  const [chatItems, setChatItems] = useState([]);
  const [conversationName, setConversationName] = useState({});
  const [conversationNameOwer, setConversationNameOwer] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [modalText, setModalText] = useState("you do you want to delete ?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [valueChat, setValueChat] = useState("");
  const [owner, setOwner] = useState(null);
  const getData = async () => {
    const postRef = doc(collection(db, "conversations"), id);
    const currentUser = collection(db, "users");
    const snapcurrentUser = await getDocs(currentUser);
    const FullUser = snapcurrentUser.docs.map((doc) => ({
      id: doc.id,
      avatarUrl: doc.data().avatarUrl,
      fullname: doc.data().fullname
    }));
    onSnapshot(postRef, async (doc) => {
      if (doc.exists()) {
        const participants = doc.data().participants;
        const participantIds = participants.map((participant) => participant.userId);
        const GetDataUse = participantIds.find((e) => e !== currentID);
        setConversationName(FullUser.find((e) => e.id === GetDataUse))
        setConversationNameOwer(FullUser.find((e) => e.id === currentID));
        setChatItems(doc.data().messages);
      } else {
        console.log("No such document!");
      }
    });

  };
  useEffect(() => {
    getData();
  }, [id]);
  const setMessage = (e) => {
    setValueChat(e);
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    const conversationsRef = doc(collection(db, "conversations"), id);
    if (valueChat !== "") {
      updateDoc(conversationsRef, {
        lastMessage: valueChat,
        createdAt: serverTimestamp(),
        messages: [
          ...chatItems,
          {
            content: valueChat,
            userID: currentID,
            createdAt: Timestamp.fromDate(new Date()),
            avatarUrl: conversationNameOwer.avatarUrl
            // userName: dataTransfer.authorName
          }
        ],
      });
      setValueChat("");
    }
  };
  //   DELETE conversations BEGIN
  const deleteConversations = async () => {
    setOpenDelete(true);
  };
  const handleOkDelete = () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const postRef = doc(collection(db, "conversations"), id);
      setOpenDelete(false);
      setConfirmLoading(false);
      await deleteDoc(postRef);
      navigate(`/Messenger`);
    }, 2000);
  };
  const handleCancelDelete = () => {
    setOpenDelete(false);
  };
  const ulRef = useRef(null);
  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [chatItems]);

  return (
    <div className="ChatBox">
      <header>
        <Link to={`/Profile/${conversationName?.id}`}>
          <div>
            <img src={conversationName?.avatarUrl} alt="" />
            <h1>{conversationName?.fullname}</h1>
          </div>
        </Link>
        <span className="deleteChat" onClick={deleteConversations}>
          X
        </span>
        <Modal
          title="Delete this chat"
          open={openDelete}
          onOk={handleOkDelete}
          confirmLoading={confirmLoading}
          onCancel={handleCancelDelete}
        >
          <p>{modalText}</p>
        </Modal>
      </header>
      <main>
        <ul ref={ulRef}>
          {chatItems.map((item, index) => {
            return (
              <li
                key={index}
                className={
                  item.userID === currentID
                    ? "messengerItem owner"
                    : "messengerItem"
                }
              >
                <div className="messengerInfo">
                  <img src={item.avatarUrl} alt="" />
                  {/* <span>Just now</span> */}
                </div>
                <div className="messageContent">
                  <p title={moment(item.createdAt.toDate()).fromNow()}>{item.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
      <footer>

        <form onSubmit={sendMessage}>
          <input
            type="text"
            name="message"
            value={valueChat}
            placeholder="Massage..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </footer>
    </div>
  );
};

export default Chatbox;
