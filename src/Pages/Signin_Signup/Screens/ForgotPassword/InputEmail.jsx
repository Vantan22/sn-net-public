import emailjs from "@emailjs/browser";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { db } from "../../../../Api/firebase";
import InputComponents from "../../Components/input";
import icon_Google from "../../Image/LogoGoogle.svg";
import icon_Yahoo from "../../Image/LogoYahoo.svg";
import { getData, onSigninGoogle, onSigninYahoo } from "../../Services";
import "./Css/ForgotPass.css";

const InputEmail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isValid, setIsValid] = useState("");
  const key = "updatable";
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const SigninGG = () => {
    onSigninGoogle(messageApi, navigate);
  };
  const SigninYahoo = () => {
    onSigninYahoo(messageApi, navigate);
  };
  //yup
  const schema = yup
    .object({
      email: yup
        .string()
        .email("Wrong email format")
        .required("Please enter your email"),
    })
    .required();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ mode: "all", resolver: yupResolver(schema) });

  const changeBoder2 = (e) => {
    setIsValid(e.target.value);
  };
  const onSubmit = async (values) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    // Start connect get data by email

    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", values.email));
    const querySnapshot = await getDocs(q);
    // End connect get data by email
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        var templateParams = {
          nguoi_nhan: values.email,
          message: `https://vawntan.web.app/newpassword/${doc.id} `,
        };
        emailjs
          .send(
            "service_th4pa3s",
            "template_0kgdqsl",
            templateParams,
            "P27QiuOKlY9hL69Wm"
          )
          .then(
            (result) => {
              setTimeout(() => {
                messageApi.open({
                  key,
                  type: "success",
                  content: "Send Mail Success",
                  duration: 2,
                  onClose: () => {
                    navigate("/login");
                  },
                });
              }, 1500);
            },
            (error) => {
              console.log(error.text);
            }
          );
      });
    } else {
      setTimeout(() => {
        messageApi.open({
          key,
          type: "error",
          content:
            "email does not exist on the system, please try again or create a new account",
          duration: 2,
          onClose: () => {
            navigate("/forgotpassword");
          },
        });
      }, 1000);
    }
  };
  return (
    <>
      {contextHolder}
      <div className="container-sign">
        <div className="nav-sign">
          <h1 className="title">forgot password </h1>
          <div className="nav-color">
            <div className="cricle cricle-red"></div>
            <div className="cricle cricle-yellow"></div>
            <div className="cricle cricle-green"></div>
          </div>
        </div>
        <h1 className="name-network">Social Network</h1>
        <p className="forgotPassword">Please enter your registered email</p>
        <form action="" onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="input-forgot">
            <InputComponents
              children="Email"
              placeholder="Enter your email"
              customStyle={
                errors.email
                  ? "passError"
                  : isValid !== ""
                  ? "pass success "
                  : "pass"
              }
              handleChange={changeBoder2}
              type="email"
              register={{
                ...register("email"),
              }}
            />
            <p className="errorText">{errors.email?.message}</p>
          </div>
          <div className="btnForgot btnForgotEmail">
            <button>SEND</button>
          </div>
          <span className="line-continue"></span>
        </form>
        <div className="continueWithForgot">
          <p>or continue with</p>
        </div>
        <div className="sign-with">
          <div onClick={SigninGG} className="sign-google">
            <div className="logo-google">
              <img src={icon_Google} alt="" className="icon_Google" />
            </div>
            <p>Login with Google</p>
          </div>
          <div onClick={SigninYahoo} className="sign-github">
            <div className="logo-github">
              <img src={icon_Yahoo} alt="" className="icon_Yahoo" />
            </div>
            <p>Login with Yahoo</p>
          </div>
        </div>
        <p className="LickNewPass">
          Already have an Account ?{" "}
          <Link className="linkLogin" to="/login">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default InputEmail;
