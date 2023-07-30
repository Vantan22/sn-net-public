import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFormData } from "../../Hooks/UseFormdata";
import InputComponents from "../../../../Components/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const Step2 = ({ formStep, nextFormStep, prevFormStep }) => {
  // use react hooks form
  const { setFormValues } = useFormData();
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState('')
  const schema = yup
    .object({
      username: yup
        .string()
        .required("Please enter a username")
        .matches(/^[a-zA-Z0-9._]+$/, "Username without accents")
        .min(6, "Enter more than 6 characters"),
      email: yup
        .string()
        .email("Enter the wrong email format")
        .required("Please enter Email"),
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
  } = useForm({ mode: "all", resolver: yupResolver(schema) });

  const onSubmit = (values) => {
    setFormValues(values);
    nextFormStep();
  };
  const onPrev = () => {
    prevFormStep();
  };
  return (
    <form
      className={formStep === 1 ? "showForm" : "hideForm"}
      action=""
      onSubmit={handleSubmit(onSubmit)}
      method="post"
    >
      <div className="input-sign">
        <InputComponents
          children="Username"
          placeholder="Enter your username"
          customStyle={errors.username ? "passError" : isValid !== '' ? 'pass success ' : 'pass'}
          handleChange={changeBoder2}
          type="text"
          register={{
            ...register("username"),
          }}
        />
        <p className="errorText">{errors.username?.message}</p>
        <InputComponents
          children="Email"
          placeholder="Enter your Email"
          customStyle={errors.email ? "passError" : value !== '' ? 'pass success ' : 'pass'}
          handleChange={changeBoder}
          type="email"
          register={{
            ...register("email"),
          }}
        />
        <p className="errorText">{errors.email?.message}</p>
      </div>
      <div className="btnSignup">
        <button onClick={onPrev} type="button">
          PREV
        </button>
        <button>NEXT</button>
      </div>
      <span className="line-continue"></span>
    </form>
  );
};

export default Step2;
