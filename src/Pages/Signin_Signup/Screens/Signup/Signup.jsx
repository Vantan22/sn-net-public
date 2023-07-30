import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon_Google from "../../Image/LogoGoogle.svg";
import icon_Yahoo from "../../Image/LogoYahoo.svg";
import { getData, onSigninGoogle, onSigninYahoo } from "../../Services";
import Step1 from "./Components/StepSignup/Step1";
import Step2 from "./Components/StepSignup/Step2";
import Step3 from "./Components/StepSignup/Step3";
import FormCard from "./Components/StepSignup/index";
import "./Css/style.css";
import FormProvider from "./Hooks/UseFormdata";

const Signup = () => {
  const [formStep, setFormStep] = useState(0);
  const [Users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);

  const SigninGG = () => {
    onSigninGoogle(messageApi, navigate)
  }
  const SigninYahoo = () => {
    onSigninYahoo(messageApi, navigate)
  }
  return (
    <>
      {contextHolder}
      <div className="container-sign">
        <div className="nav-sign">
          <h1 className="title">Sign up</h1>
          <div className="nav-color">
            <div className="cricle cricle-red"></div>
            <div className="cricle cricle-yellow"></div>
            <div className="cricle cricle-green"></div>
          </div>
        </div>
        <h1 className="name-network">Social Network</h1>
        <FormProvider>
          <FormCard currentStep={formStep}>
            {formStep >= 0 && (
              <Step1 formStep={formStep} nextFormStep={nextFormStep} />
            )}
            {formStep >= 1 && (
              <Step2
                formStep={formStep}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            )}
            {formStep >= 2 && (
              <Step3
                formStep={formStep}
                nextFormStep={nextFormStep}
                prevFormStep={prevFormStep}
              />
            )}
          </FormCard>
        </FormProvider>
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
          Already have an Account ?{" "}
          <Link className="linkLogin" to="/login">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
