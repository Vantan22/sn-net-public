import { Input, Modal } from "antd";
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Api/firebase";
import icon_create_messenger from "../../img/editpost/edit-06.svg";
import ChatListItem from "./ChatListItem";
import "./Messenger.css";

const { TextArea } = Input;
const currentID = localStorage.getItem("ID");
const Messenger = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedChat, setSelectedChat] = useState(null);

  const inputRef = useRef(null);
  const [searchUser, setSearchUser] = useState([]);
  const [state, setState] = useState({ query: "", list: [] });
  const [conversation, setConversation] = useState([]);
  const [users, setUsers] = useState([]);
  const getData = async () => {
    const searchUserr = collection(db, "users");
    const snapshotuser = await getDocs(searchUserr);
    const currentUser = collection(db, "users");
    const snapcurrentUser = await getDocs(currentUser);
    setUsers(
      snapcurrentUser.docs.map((doc) => ({
        id: doc.id,
        userName: doc.data().name,
        avatarUrl: doc.data().avatarUrl,
        fullname: doc.data().fullname,
      }))
    );
    const postsCol = collection(db, "conversations");

    const q = query(postsCol, orderBy("createdAt", "desc"));
    onSnapshot(
     q,
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
              (e) => e.userIds[0] == currentID || e.userIds[1] == currentID
            )
        );
      },
      (error) => {
        console.log(error);
      }
    );

    setSearchUser(
      snapshotuser.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((doc) => doc.id !== currentID)
    );
    // setConversationName(conversation.filter(e => e.userIds[0] == currentID || e.userIds[1] == currentID));
  };
  const handleChange = (e) => {
    const results = searchUser.filter((user) => {
      if (e.target.value === "") return searchUser;
      return user.fullname.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setState({
      query: e.target.value,
      list: results,
    });
  };

  useEffect(() => {
    getData();
  }, []);
  const clearInput = () => {
    inputRef.current.value = "";
    setState({ query: "", list: [] });
    setModalOpen(false);
  };
  const handleUserSelect = async (user) => {
    const currentUserInfo = users.find((user) => user.id === currentID);
    const checkConversation = conversation.filter(
      (e) => e.userIds[0] === user.id || e.userIds[1] === user.id
    );
    const conversationRef = collection(db, "conversations");
    const usersCol = collection(db, "notification");
    if (checkConversation.length === 0) {
      await addDoc(conversationRef, {
        userIds: [user.id, currentID],
        createdAt: serverTimestamp(),
        lastMessage: null,
        unreadCount: 0,
        participants: [
          {
            userId: user.id,
            fullName: user.fullname,
            avatarUrl: user.avatarUrl,
          },
          {
            userId: currentID,
            fullName: currentUserInfo.fullname,
            avatarUrl: currentUserInfo.avatarUrl,
          },
        ],
        messages: [],
      }).then((docRef) => {
        addDoc(usersCol, {
          sender: currentID,
          receiver: [user.id],
          avatarUrl: currentUserInfo.avatarUrl,
          fullName: currentUserInfo.fullname,
          messageTo: ``,
          messageFrom: `You have a new chat with ${currentUserInfo.fullname}.`,
          createAt: serverTimestamp(),
          idpost: docRef.id,
          status: 4,
        });
        navigate(`/Messenger/${docRef.id}`);
      })
        .catch((error) => console.log(error));
    } else {
      navigate(`/Messenger/${checkConversation[0]?.id}`);
    }
    setModalOpen(false);
  };
  const TransferId = (id) => {
    setSelectedChat(id);
    navigate(`/Messenger/${id}`);
  };
  return (
    <div className="chat">
      <div className="chat-container">
        <div className="conversations">
          <header>
            <h1>Messenger</h1>
            <img
              src={icon_create_messenger}
              className="iconCreate"
              alt=""
              onClick={() => setModalOpen(true)}
            />
            <Modal
              className="modalchat"
              // title="New message"
              top
              open={modalOpen}
              closable={false}
              footer={null}
            >
              <header className="header-modal-createMessenger">
                <span onClick={clearInput} className="btn-cancel">
                  Cancel
                </span>
                <span className="new-message-title">New Message</span>
                <span className="btn-chat"></span>
              </header>
              <div className="Search-User-chat">
                <span>To :</span>
                <input
                  type="text"
                  placeholder="Search"
                  ref={inputRef}
                  value={state.query}
                  onChange={handleChange}
                  className="inputUserChat"
                />
              </div>
              <div className="Search-User-chat-list">
                <ul>
                  {state.query === ""
                    ? ""
                    : state.list.map((user) => {
                      return (
                        <li
                          key={user.id}
                          className="newMessage-item"
                          onClick={() => handleUserSelect(user)}
                        >
                          <img src={user.avatarUrl} alt="" />
                          <span>{user.fullname}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </Modal>
          </header>
          <main>
            {conversation.map((chat) => (
              <div key={chat.id}>
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

export default Messenger;
