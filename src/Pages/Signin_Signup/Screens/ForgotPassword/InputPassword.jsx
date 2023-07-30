import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from 'antd';
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { db } from "../../../../Api/firebase";
import InputComponents from "../../Components/input";
import icon_Google from "../../Image/LogoGoogle.svg";
import icon_Yahoo from "../../Image/LogoYahoo.svg";
import { getData, onSigninGoogle, onSigninYahoo } from "../../Services";
import "./Css/ForgotPass.css";


const InputPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirlPasswordShown] = useState(false);
  const [Users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState('')
  const key = 'updatable';
  let { DocumentId } = useParams()
  const togglePassword = (isPas) => {
    isPas === true
      ? setPasswordShown(!passwordShown)
      : setconfirlPasswordShown(!confirmPasswordShown);
  };
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);
  // Signin Google
  const SigninGG = () => {
    onSigninGoogle(messageApi, navigate)
  }
  // Signin Yahoo
  const SigninYahoo = () => {
    onSigninYahoo(messageApi, navigate)
  }

  // yup
  const schema = yup
    .object({
      password: yup
        .string()
        .required("Please enter a password")
        .matches(/^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/, "Password without accents")
        .min(6, "Enter more than 6 characters")
        .trim(),
      ConfirmPassword: yup
        .string()
        .required("Please enter a confirm password")
        .matches(/^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/, "Password without accents")
        .min(6, "Enter more than 6 characters")
        .trim(),
    })
    .required();
  const changeBoder = (e) => {
    setValue(e.target.value)
  };
  const changeBoder2 = (e) => {
    setIsValid(e.target.value)
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const onSubmit = (values) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    setTimeout(() => {
      if (values.password === values.ConfirmPassword) {
        const frankDocRef = doc(db, "users", DocumentId);
        updateDoc(frankDocRef, {
          password: values.password
        });
        messageApi.open({
          key,
          type: "success",
          content:
            "Yeah! You have successfully changed your password. ",
          duration: 2,
          onClose: () => {
            navigate("/login");
          },
        });
      } else {
        messageApi.open({
          key,
          type: "warning",
          content:
            "Oops! Looks like the two passwords are not the same, try again!",
          duration: 2,
        });
      }
    }, 1500);
  };
  return (
    <>
      {contextHolder}
      <div className="container-sign">
        <div className="nav-sign">
          <h1 className="title">New password</h1>
          <div className="nav-color">
            <div className="cricle cricle-red"></div>
            <div className="cricle cricle-yellow"></div>
            <div className="cricle cricle-green"></div>
          </div>
        </div>
        <h1 className="name-network">Social Network</h1>
        <p className="forgotPassword">Please enter a new password</p>
        <form onSubmit={handleSubmit(onSubmit)} action="" method="post">
          <div className="input-NewPass">
            <InputComponents
              children="New Password"
              placeholder="Enter your new password"
              customStyle={errors.password ? "passError" : isValid !== '' ? 'pass success ' : 'pass'}
              type={passwordShown ? "text" : "password"}
              register={{
                ...register("password"),
              }}
              handleChange={changeBoder2}
            />
            <FontAwesomeIcon
              onClick={() => togglePassword(true)}
              className="icon"
              icon={passwordShown ? faEyeSlash : faEye}
            />
            <p className="errorText">{errors.password?.message}</p>

            <InputComponents
              children="Confirm New Password"
              placeholder="Enter your confirm new password"
              customStyle={errors.ConfirmPassword ? "passError" : value !== '' ? 'pass success ' : 'pass'}
              handleChange={changeBoder}
              type={confirmPasswordShown ? "text" : "password"}
              register={{
                ...register("ConfirmPassword"),
              }}
            />
            <FontAwesomeIcon
              onClick={() => togglePassword(false)}
              className="icon"
              icon={confirmPasswordShown ? faEyeSlash : faEye}
            />
            <p className="errorText">{errors.ConfirmPassword?.message}</p>
          </div>
          <div className="btnForgot">
            <button>SEND</button>
          </div>
          {/* <span className="line-continue"></span> */}
        </form>
        <span className="line-continue-forgot"></span>
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
              <img src={icon_Yahoo} alt="" className="icon_Github" />
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
      </div></>

  );
};

export default InputPassword
