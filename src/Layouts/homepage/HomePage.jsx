import { Col, Row } from "antd";
import React, { useEffect, useState, createContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import icon_newsfeed from "../../img/menu_icon/group.svg";
import icon_messenger from "../../img/menu_icon/icon_message.svg";
import icon_noti from "../../img/menu_icon/icon__Component.svg";
import icon_logout from "../../img/menu_icon/logouticon.svg";
import icon_search from "../../img/menu_icon/search-favorite.svg";
import icon_short from "../../img/vuesax/linear/video-square.png";
import icon_friends from "../../img/vuesax/linear/friends.svg";
import "../homepage/Homepage.css";
import icon_Chatbot from "../../img/trash/comment-question.png";
// import Signin from '../../Pages/Signin';
import { message } from "antd";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../Api/firebase";
import Notification from "../../Pages/Notifications/Notification";
import logo from "../../img/smail logologo.svg";
import Search from "../../Pages/Search/Search";
import NavigationItem from "./NavigationItem";

export const MenuStateContext = createContext();

const authc = getAuth();
// const avatar = auth.currentUser.photoURL
const HomePage = () => {
  const navigate = useNavigate();
  const curentId = localStorage.getItem("ID");

  const [messageApi, contextHolder] = message.useMessage();

  const [avatarUrl, setAvatarUrl] = useState("");

  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [menuState, setMenuState] = useState({
    searchCollapsed: false,
    notificationCollapsed: false,
  });
  const [dataPostAPI, setDataPostAPI] = useState("");

  const handleSearch = () => {
    if (menuState.notificationCollapsed && !menuState.searchCollapsed) {
      setMenuState({
        notificationCollapsed: false,
        searchCollapsed: true,
      });
      setMenuCollapsed(false);
    }
    if (!menuState.notificationCollapsed && menuState.searchCollapsed) {
      setMenuState({
        notificationCollapsed: false,
        searchCollapsed: false,
      });
      setMenuCollapsed(true);
    } else {
      setMenuCollapsed(false);
      setMenuState({
        notificationCollapsed: false,
        searchCollapsed: true,
      });
    }
  };
  const handleColsenoti = () => {
    setMenuCollapsed(false);
    setMenuState({
      notificationCollapsed: false,
      searchCollapsed: true,
    });
  }

  const handleNotification = () => {
    if (menuState.searchCollapsed && !menuState.notificationCollapsed) {
      setMenuState({
        notificationCollapsed: true,
        searchCollapsed: false,
      });
      setMenuCollapsed(false);
    }
    if (!menuState.searchCollapsed && menuState.notificationCollapsed) {
      setMenuState({
        notificationCollapsed: false,
        searchCollapsed: false,
      });
      setMenuCollapsed(true);
    } else {
      setMenuCollapsed(false);
      setMenuState({
        notificationCollapsed: true,
        searchCollapsed: false,
      });
    }
  };
  const handleCloseCollapse = () => {
    setMenuCollapsed(true);
    setMenuState({
      notificationCollapsed: false,
      searchCollapsed: false,
    });
  };
  const redirectToShortVideoPage = () => {
    const postsCol = collection(db, "shortVideo");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
      }));
      navigate(`/short/${data[0].id}`);
    });
  };

  useEffect(() => {
    const postsCol = collection(db, "shortVideo");
    const q = query(postsCol, orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
      }));
      setDataPostAPI(data[0]?.id);
    });
  }, []);

  const key = "updatable";

  const getData = async () => {
    onSnapshot(doc(db, "users", curentId), (doc) => {
      setAvatarUrl(doc.data().avatarUrl);
    });
  };
  useEffect(() => {
    // return getData;
    getData()
  }, []);

  const signOutt = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    setTimeout(() => {
      signOut(authc)
        .then(() => {
          localStorage.removeItem("ID");

          messageApi.open({
            key,
            type: "success",
            content: "Sign Out Success",
            duration: 1,
            onClose: () => {
              navigate("login");
            },
          });
        })
        .catch((error) => {
          messageApi.open({
            key,
            type: "error",
            content: "Logout failed, please try again!",
            duration: 1,
          });
          // An error happened.
        });
    }, 1000);
  };
  const value = {
    setMenuCollapsed,
    setMenuState,
    menuState
  }

  return (
    // loading ? (<Spin indicator={antIcon} />) :
    <>
      <MenuStateContext.Provider value={value}>

        <div className="homepageLayout">
          {contextHolder}
          <div
            className={`layout-bg ${menuState.searchCollapsed ? "active" : ""}`}
          >
            <Search />
          </div>
          <div
            className={`layout-bg ${menuState.notificationCollapsed ? "active" : ""
              }`}
          >
            <Notification handleColsenoti={handleColsenoti} />
          </div>
          <div className="flex">
            <div className="newsfeed-navigation">
              <div className={`tab-nav ${menuCollapsed ? "" : "active"}`}>
                <div className="logopage">
                  {menuCollapsed ? (
                    <Link
                      to="https://vawntan.web.app/"
                      className="logo"
                      title="Social Network"
                    >
                      Social Network
                    </Link>
                  ) : (
                    <Link to="https://vawntan.web.app/">
                      <img
                        src={logo}
                        title="Social Network"
                        className="logomini"
                      />
                    </Link>
                  )}
                  {menuCollapsed ? <h2>Menus</h2> : <div> </div>}
                </div>

                <div className={`nav-space ${menuCollapsed ? "" : "active"}`}>
                  <div className="tab-nav-menu">
                    <nav
                      className={`nav-menu-list ${menuCollapsed ? "" : "active"}`}
                    >
                      <Link
                        onClick={handleCloseCollapse}
                        className="link-nav icon-menu"
                        to={`/Profile/${curentId}`}
                      >
                        <NavigationItem
                          icon={avatarUrl}
                          mode={menuCollapsed}
                          name="Profile"
                        />
                      </Link>
                      <Link
                        className="link-nav icon-menu"
                        to="/"
                        onClick={handleCloseCollapse}
                      >
                        <NavigationItem
                          icon={icon_newsfeed}
                          mode={menuCollapsed}
                          name="Newsfeed"
                        />
                      </Link>
                      <Link
                        className="link-nav"
                        to="/Friends"
                        onClick={handleCloseCollapse}
                      >
                        <img src={icon_friends} className="icon icon-menu" />
                        <span className="text-menu">Friends</span>
                      </Link>
                      <Link className="link-nav icon-menu" onClick={handleSearch}>
                        <NavigationItem
                          link="#"
                          icon={icon_search}
                          mode={menuCollapsed}
                          name="Search"
                        />
                      </Link>
                      <Link
                        className="link-nav icon-menu"
                        to="Messenger"
                        onClick={handleCloseCollapse}
                      >
                        <NavigationItem
                          icon={icon_messenger}
                          mode={menuCollapsed}
                          name="Message"
                        />
                      </Link>
                      <Link
                        className="link-nav"
                        to="Chatbot"
                        onClick={handleCloseCollapse}
                      >
                        <img src={icon_Chatbot} className="icon icon-menu" />
                        <span className="text-menu">Chatbot</span>
                      </Link>
                      <Link
                        className="link-nav icon-menu"
                        onClick={handleNotification}
                      >
                        <NavigationItem
                          icon={icon_noti}
                          mode={menuCollapsed}
                          name="Notifications"
                        />
                      </Link>
                      <Link
                        className="link-nav icon-menu"
                        to={"/short/" + dataPostAPI}
                        onClick={handleCloseCollapse}
                      >
                        <NavigationItem
                          icon={icon_short}
                          mode={menuCollapsed}
                          name="Short video"
                        />
                      </Link>
                    </nav>
                  </div>
                  <div className="tab-nav-more">
                    <Link className="link-nav icon-menu" onClick={signOutt}>
                      <NavigationItem
                        icon={icon_logout}
                        mode={menuCollapsed}
                        name="Log out"
                      />
                      {/* <img src={icon_logout} className="icon icon-menu" />
                    <span className="text-menu">Log out</span> */}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="newsfeed-content">
              <Outlet />
            </div>
          </div>
        </div>
      <div className="Homepage-responsive">
        <p>
          Hehe tôi vẫn chưa up date cho màn hình này đâu :D Chở app sắp tới nhé
        </p>
      </div>
      </MenuStateContext.Provider>
    </>
  );
};

export default HomePage;
