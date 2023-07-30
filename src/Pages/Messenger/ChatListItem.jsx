import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Api/firebase";

function ChatListItem({ chat, TransferId }) {

  const [conversationName, setConversationName] = useState([]);
  const chatParticipantsId =  chat.participants

  const user = [ chatParticipantsId[0].userId , chatParticipantsId[1].userId]
  const currentID = localStorage.getItem("ID");
  const findUser = user.find((user)=> user !==currentID )

  const userGetData = findUser === undefined ? currentID : findUser

  const [guestUser, setGuestUser] = useState({});
  const getData = async () => {
    const postRef = doc(collection(db, "users"), userGetData);
    const postDoc = await getDoc(postRef);
    setConversationName(
      postDoc.data()
    )

  };
  useEffect(() => {
    getData();
  }, []);
  return (
    
    <div  className="chat-list-item" onClick={()=> {TransferId(chat.id)}}>
      <img src={conversationName.avatarUrl} alt="" className="chat-list-item-avatar" />
      <div>
        <p className="chat-list-item-name">{conversationName.fullname}</p>
        <p className={chat.unreadCount > 0 ?"chat-list-item-last-message active" :"chat-list-item-last-message"}>{chat.lastMessage == null?"" :chat.lastMessage}</p>
      </div>
      {
        chat.unreadCount > 0 ?<span className="uncreadCount"></span> : ""
      }
        
    </div>
  );
}

export default ChatListItem;
