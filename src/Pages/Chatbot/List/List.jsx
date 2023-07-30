import React from "react";
import avatarChat from "../ChatGPT_logo.svg.webp";
  function ChatListItem({ chat, TransferId }) {
    return (
      
      <div  className="chat-list-item" onClick={()=> {TransferId(chat.id)}}>
        <img src={avatarChat} alt="" className="chat-list-item-avatar" />
        <div>
          <p className="chat-list-item-name">ChatGpt</p>
          <p className={chat.unreadCount > 0 ?"chat-list-item-last-message active" :"chat-list-item-last-message"}>{chat.lastMessage == null?"" :chat.lastMessage}</p>
        </div>
        {
          chat.unreadCount > 0 ?<span className="uncreadCount"></span> : ""
        }
          
      </div>
    );
  }
  
  export default ChatListItem;
  