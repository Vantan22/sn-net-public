import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFormData } from "../../Hooks/UseFormdata";
import InputComponents from "../../../../Components/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


const Step1 = ({ formStep, nextFormStep }) => {
  // use react hooks form
  const { setFormValues } = useFormData();
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState('')
  const onSubmit = (values) => {
    setFormValues(values);
    nextFormStep();
  };
  const schema = yup
    .object({
      firstname: yup
        .string()
        .required("Please enter Firts Name")
        .matches(/\D/i, "Wrong format, not write number"),
      lastname: yup
        .string()
        .required("Please enter Last Name")
        .matches(/\D/i, "Wrong format, not write number"),
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
  return (
    <form
      className={formStep === 0 ? "showForm" : "hideForm"}
      onSubmit={handleSubmit(onSubmit)}
      action=""
      method="post"
    >
      <div className="input-sign inpuSignUp">
        <InputComponents
          children="First Name"
          placeholder="Enter your First Name"
          customStyle={errors.firstname ? "passError" : value !== '' ? 'pass success ' : 'pass'}
          handleChange={changeBoder}
          type="text"
          register={{
            ...register("firstname"),
          }}
        />
        <p className="errorText">{errors.firstname?.message}</p>
        <InputComponents
          children="Last Name"
          placeholder="Enter your Last Name"
          customStyle={errors.lastname ? "passError" : isValid !== '' ? 'pass success ' : 'pass'}
          handleChange={changeBoder2}
          type="text"
          register={{
            ...register("lastname"),
          }}

        />
        <p className="errorText">{errors.lastname?.message}</p>
      </div>
      <div className="btnLogin btnLoginNext">
        <button className="btnNext">NEXT</button>
      </div>
      <span className="line-continue"></span>
    </form>
  );
};

export default Step1;
