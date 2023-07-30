import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { db } from "../../../Api/firebase";
import "../../Messenger/Messenger.css";
import avatarChat from "../ChatGPT_logo.svg.webp";
import ChatListItem from "./List";

const currentID = localStorage.getItem("ID");
const ListChatbot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState([]);

  const [users, setUsers] = useState([]);
  const getData = async () => {
    const currentUser = collection(db, "users");
    const snapcurrentUser = await getDocs(currentUser);
    setUsers(
      snapcurrentUser.docs.map((doc) => ({
        id: doc.id,
        userName: doc.data().fullname,
        avatarUrl: doc.data().avatarUrl,
        fullname: doc.data().fullname,
      }))
    );
    onSnapshot(
      collection(db, "chatbot"),
      (snapshot) => {
        setConversation(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              createdAt: doc.data().createdAt,
              participants: doc.data().participants,
              lastMessage: doc.data().lastMessage,
              unreadCount: doc.data().unreadCount,
              userIds: doc.data().userIds,
            }))
            .filter(
              (e) => e.userIds == currentID
            )
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUserSelect = async (user) => {
    const currentUserInfo = users.find((user) => user.id === currentID);
    const conversationRef = collection(db, "chatbot");
    await addDoc(conversationRef, {
      userIds: currentID,
      createdAt: serverTimestamp(),
      lastMessage: 'Xin chào! Rất vui được gặp bạn! Có thể giúp gì được bạn không?',
      unreadCount: 0,
      participants: [
        {
          userId: "ChatGpt",
          userName: "ChatGpt",
          avatarUrl: avatarChat,
        },
        {
          userId: currentID,
          userName: currentUserInfo.userName,
          avatarUrl: currentUserInfo.avatarUrl,
        },
      ],
      messages: [
        {
          chatgpt: 'Xin chào! Rất vui được gặp bạn! Có thể giúp gì được bạn không?',
          userID: currentID,
          createdAt: Timestamp.fromDate(new Date()),
          userAvatar: currentUserInfo.avatarUrl,
        }
      ],
    }).then((value) => {
      navigate(`/Chatbot/${value.id}`);
    })
  };
  const TransferId = (id) => {
    navigate(`/Chatbot/${id}`);
  };

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="conversations">
          <header>
            <h1>Chatbot</h1>
            <p className="ButtonNewchat" alt="" onClick={handleUserSelect}>
              New chat
            </p>
          </header>
          <main>
            {conversation.map((chat) => (
              <div key={chat.id} >
                <ChatListItem
                  TransferId={TransferId}
                  chat={chat}
                />
              </div>
            ))}
          </main>
        </div>
        <div className="chat-conversations">
          {id !== undefined ? (
            <Outlet />
          ) : (
            <div className="no-chat-selected">
              <span>No chat selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListChatbot;
