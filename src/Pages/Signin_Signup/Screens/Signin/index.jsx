import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import InputComponents from "../../Components/input";
import icon_Google from "../../Image/LogoGoogle.svg";
import icon_Yahoo from "../../Image/LogoYahoo.svg";
import { getData, onSigninGoogle, onSigninYahoo } from "../../Services";
import "./Css/style.css";

const Signin = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [Users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState("");
  const key = "updatable";

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const navigate = useNavigate();
  useEffect(() => {
    getData().then(async (data) => {
      setUsers(data)
    })
  }, []); 
  const SigninGG = () => {
    onSigninGoogle(messageApi, navigate)
  }
  const SigninYahoo = () => {
    onSigninYahoo(messageApi, navigate)
  }
  //yup
  const schema = yup
    .object({
      password: yup
        .string()
        .required("Please enter a password")
        .matches(/^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/, "Password without accents")
        .min(6, "Enter more than 6 characters"),
      username: yup
        .string()
        .required("Please enter a username")
        .matches(/^[a-zA-Z0-9._]+$/, "Username without accents")
        .min(6, "Enter more than 6 characters"),
    })
    .required();

  // react-hook-form
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ mode: "all", resolver: yupResolver(schema) });
  const changeBoder = (e) => {
    setValue(e.target.value);
  };
  const changeBoder2 = (e) => {
    setIsValid(e.target.value);
  };
  const onSubmit = (values) => {
    const user = Users.find((item) => item.username === values.username);
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });

    setTimeout(() => {
      if (!user) {
        messageApi.open({
          key,
          type: "warning",
          content:
            "Oops! Account not found please register or create a new account!",
          duration: 2,
        });
      } else {
        if (user.password !== values.password) {
          messageApi.open({
            key,
            type: "warning",
            content: "Oops! Password please try again!",
            duration: 2,
          });
        } else {
          messageApi.open({
            key,
            type: "success",
            content: "Sign In Successfully",
            duration: 2,
            onClose: () => {
              navigate("/");
            },
          });
          localStorage.setItem("ID", user.id);
        }
      }
    }, 1500);
  };

  return (
    <>
      {contextHolder}
      <div className="container-sign">
        <div className="nav-sign">
          <h1 className="title">Sign in</h1>
          <div className="nav-color">
            <div className="cricle cricle-red"></div>
            <div className="cricle cricle-yellow"></div>
            <div className="cricle cricle-green"></div>
          </div>
        </div>

        <h1 className="name-network">Social Network</h1>
        <form action="" onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="input-sign">
            <InputComponents
              children="User Name"
              placeholder="Enter your username"
              customStyle={
                errors.username
                  ? "passError"
                  : value !== ""
                  ? "pass success "
                  : "pass"
              }
              register={{
                ...register("username"),
              }}
              handleChange={changeBoder}
            />
            <p className="errorText">{errors.username?.message}</p>
            <InputComponents
              children="Password"
              placeholder="Enter your password"
              customStyle={
                errors.password
                  ? "passError"
                  : isValid !== ""
                  ? "pass success "
                  : "pass"
              }
              classP="password"
              handleChange={changeBoder2}
              type={passwordShown ? "text" : "password"}
              register={{
                ...register("password"),
              }}
            />
            <FontAwesomeIcon
              onClick={togglePassword}
              className="icon eyse"
              icon={passwordShown ? faEyeSlash : faEye}
            />
            <p className="errorText">{errors.password?.message}</p>
          </div>
          <div className="remember">
            <Link to="/forgotpassword" className="remember-signIn">
              Forgot PassWord ?
            </Link>
          </div>
          <div className="btnLogin">
            <button>Login</button>
          </div>
        </form>
        <span className="line-continue"></span>

        <div className="continueWith">
          <p>or continue with</p>
        </div>
        <div className="sign-with">
          <div onClick={SigninGG} className="sign-google">
            <img src={icon_Google} alt="" className="icon_Google" />
            <p>Login with Google</p>
          </div>
          <div onClick={SigninYahoo} className="sign-github">
            <div className="logo-github">
              <img src={icon_Yahoo} alt="" className="icon_Yahoo" />
            </div>
            <p>Login with Yahoo</p>
          </div>
        </div>
        <p className="register">
          Don't have an Account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </>
  );
};

export default Signin;
