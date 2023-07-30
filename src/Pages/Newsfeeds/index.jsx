import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../Api/firebase";
import UserItem from "./Components/UserItem";
import CreatePost from "./CreatePost/Createpost";
import Posts from "./Posts/Posts";
import "./css/Newsfeed.css";
import { getDocumentUser } from "./services/services";

const Newsfeeds = () => {
  const currentId = localStorage.getItem("ID");
  const [dataPostAPI, setDataPostAPI] = useState([]);
  const [UserCurren, setUserCurren] = useState([]);
  const [Users, setUsers] = useState([]);
  const [userGet, setUserGet] = useState({});
  useEffect(() => {
    getDocumentUser().then((data) => {
      setUserGet(data.find((item) => item.id === currentId));
    });
    const postsCol = collection(db, "postItem");

    const q = query(postsCol, orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timeElapsed: doc.data().createdAt && moment(doc.data().createdAt.toDate()).fromNow()
      }));
     setDataPostAPI(data);

    });
    setInterval(() => {
      const q = query(postsCol, orderBy("createdAt", "desc"));
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          timeElapsed: moment(doc.data().createdAt.toDate()).fromNow()
        }));

        setDataPostAPI(data);
      });
    }, 60000);
  }, []);
  const User = () => {
    onSnapshot(doc(db, "users", currentId), (doc) => {
      setUserCurren(doc.data());
    });
  };
  useEffect(() => {
    getDocumentUser().then((data) => {
      setUsers(data);
    });

    User();
  }, []);
  const Suggetions = Users.filter(
    (objA) => !UserCurren?.friend.some((objB) => objA.id === objB.id)
  );
  const Suggetions2 = Suggetions.filter(
    (objA) => !UserCurren?.block.some((objB) => objA.id === objB.id)
  );
  const Friend = Users.filter((objA) =>
    UserCurren?.friend.some((objB) => objA.id === objB.id && objB.status === 1)
  );

  // onClick = {() => { navigate(`/${e.id}`) }}
  return (
    <>
      <div id="newsfeed">
        <div className="flex">
          <div className="posts ">
            <div className="al-center">
              <div className="gutter-row">
                <CreatePost
                  user={userGet}
                  avatar={userGet === undefined ? "" : userGet.avatarUrl}
                />
              </div>
            </div>

            <div>
              <div className="gutter-row">
                <ul>
                  {dataPostAPI.map((e) => (
                    <li key={e.id}>
                      <Posts
                        userSuggestt={userGet?.avatarUrl}
                        id={e.id}
                        data={e}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="suggestions">
            <div className="flex mt-40">
              <h2 className="Sugget">Suggestions </h2>
              <Link to="/Friends/Suggestions">See all</Link>
            </div>
            <hr />
            {Suggetions2.filter(
              (item, index) => index < 8 && item.id !== currentId
            ).map((item) => (
              <UserItem dataUser={item} userTitle key={item.id}></UserItem>
            ))}

            <div className="flex mt-30">
              <h2 className="Friends">Friends</h2>
              <Link to="/Friends/AllFriends">See all</Link>
            </div>
            <hr />
            <div className="overflow-hidden">
              {Friend.filter((item, index) => index < 8).map((item) => (
                <UserItem dataUser={item} key={item.id}></UserItem>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Newsfeeds;
