import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouter = (props) => {
  //   const { user } = isAuthenticate();
  const  user  = localStorage.getItem("ID");
  if (user) {
    return props.children;
  }
  return <Navigate to="/login" />;
};

export default PrivateRouter;

