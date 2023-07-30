/* eslint-disable no-undef */
import React from "react";
import { Outlet } from "react-router-dom";
import "./Css/index.css";
import img from "./Image/Isolation_Mode.png";
import img2 from "./Image/Layer_1.png";
import ImageLayout from './Components/ImageLayouts.jsx';
import { useLocation } from "react-router-dom";
const Signinup = () => {
  const location = useLocation();
  return (
    <>
    <div className="no-responsive">
      <p>Chưa hỗ trợ cho điện thoại đâu, chúng tôi sẽ update sau.</p>
    </div>
      <div className="grid-container login">
        <div className="modal-Sign">
          <Outlet />
          <ImageLayout
            img={location.pathname === "/login" ? img : img2}
            children="chat with each other anytime, anywhere"
            customStyle="text"
            classname="grid-item"
          />
        </div>
      </div>
    </>

  );
};

export default Signinup;
