import { Modal, message } from "antd";
import axios from "axios";
import avatarChat from "./ChatGPT_logo.svg.webp";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Api/firebase";
import { useEffect } from "react";
import { useRef } from "react";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [modalText, setModalText] = useState("you do you want to delete ?");
  const currentID = localStorage.getItem("ID");
  const [chatItems, setChatItems] = useState([]);
  const [conversationName, setConversationName] = useState([]);
  const [conversationNameOwer, setConversationNameOwer] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };
  const getData = async () => {
    const postRef = doc(collection(db, "chatbot"), id);

    onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setChatItems(doc.data().messages);
        const GetDataUse = doc
          .data()
          .participants.find((e) => e.userId !== currentID);

        setConversationName(GetDataUse);
        const GetDataUseOwer = doc
          .data()
          .participants.find((e) => e.userId === currentID);
        setConversationNameOwer(GetDataUseOwer);
      } else {
        console.log("No such document!");
      }
    });
  };
  useEffect(() => {
    getData();
  }, [id]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const prompt = question.trim();
    const conversationsRef = doc(collection(db, "chatbot"), id);
    updateDoc(conversationsRef, {
      createdAt: serverTimestamp(),
      messages: [
        ...chatItems,
        {
          content: prompt,
          userID: currentID,
          createdAt: Timestamp.fromDate(new Date()),
          userAvatar: conversationNameOwer.avatarUrl,
        },
      ],
    }).then(setQuestion(""));

    if (prompt) {
      axios
        .post(
          "https://api.openai.com/v1/engines/text-davinci-003/completions",
          {
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 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`,
            },
          }
        )
        .then((response) => {
          const test = response.data.choices[0].text;
          updateDoc(conversationsRef, {
            lastMessage: test,
            createdAt: serverTimestamp(),
            messages: [
              ...chatItems,
              {
                content: prompt,
                chatgpt: test,
                userID: currentID,
                createdAt: Timestamp.fromDate(new Date()),
                userAvatar: conversationNameOwer.avatarUrl,
              },
            ],
          });
        })
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            messageApi.open({
              type: "warning",
              content: "Bị chặn rồi !",
              duration: 5,
            });
          }
        });
    }
  };
  // remove
  const deleteConversations = async () => {
    setOpenDelete(true);
  };
  const handleOkDelete = () => {
    setModalText("please wait a moment");
    setConfirmLoading(true);
    setTimeout(async () => {
      const postRef = doc(collection(db, "chatbot"), id);
      setOpenDelete(false);
      setConfirmLoading(false);
      await deleteDoc(postRef);
      navigate(`/Chatbot`);
    }, 2000);
  };
  const handleCancelDelete = () => {
    console.log("Clicked cancel button");
    setOpenDelete(false);
  };
  const ulRef = useRef(null);
  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [chatItems]);
  return (
    <div>
      {contextHolder}
      <div className="ChatBox">
        <header>
          <Link to={`/Profile/${conversationName.userId}`}>
            <div>
              <img src={conversationName.avatarUrl} alt="" />
              <h1>{conversationName.userName}</h1>
            </div>
          </Link>
          <span className="deleteChat" onClick={deleteConversations}>
            X
          </span>
          <Modal
            title="Delete post"
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
                <div key={Math.random()}>
                  {item.content ? <li

                    className="messengerItem owner"
                  >
                    <div className="messengerInfo">
                      <img src={item.userAvatar} alt="" />
                    </div>
                    <div className="messageContent">
                      <p>{item.content}</p>
                    </div>
                  </li> : ''}
                  <li
                    className="messengerItem"
                  >
                    <div className="messengerInfo">
                      <img src={avatarChat} alt="" />
                    </div>
                    <div className="messageContent">
                      <p>{item.chatgpt ? item.chatgpt : "..."}</p>
                    </div>
                  </li>
                </div>

              );
            })}
          </ul>
        </main>
        <footer>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="message"
              value={question}
              placeholder="Massage..."
              onChange={handleQuestionChange}
            />
            <button type="submit">Send</button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default Chatbot;
