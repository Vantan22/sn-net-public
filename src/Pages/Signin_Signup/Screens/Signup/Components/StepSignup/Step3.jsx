import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { auth, db, storage } from "../../../../../../Api/firebase";
import InputComponents from "../../../../Components/input";
import { useFormData } from "../../Hooks/UseFormdata";
const randomIndex = Math.floor(Math.random() * 8);

const Step3 = ({ formStep, prevFormStep }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirlPasswordShown] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState("");
  const key = "updatable";
  const [arrayListImages, setArraylistImages] = useState([]);
  const onPrev = () => {
    prevFormStep();
  };
  const togglePassword = (isPas) => {
    isPas === true
      ? setPasswordShown(!passwordShown)
      : setconfirlPasswordShown(!confirmPasswordShown);
  };
  const navigate = useNavigate();
  // use React hooks form
  const { data } = useFormData();
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
    setValue(e.target.value);
  };
  const changeBoder2 = (e) => {
    setIsValid(e.target.value);
  };
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ mode: "all", resolver: yupResolver(schema) });
  useEffect(() => {
    const storageRef = ref(storage, "avatarRandom");
    listAll(storageRef)
      .then((res) => {
        const promises = res.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => url)
        );
        Promise.all(promises).then((urls) => {
          setArraylistImages(urls);

        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = async (values) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("username", "==", data.username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      setTimeout(() => {
        if (values.password === values.ConfirmPassword) {
          // setRandomImage(arraylistImages[randomIndex]);
          createUserWithEmailAndPassword(auth, data.email, values.password)
            .then((userCredential) => {
              sendEmailVerification(userCredential.user);
              // alert("Vui lòng check email");
              const usersCol = collection(db, "users");
              addDoc(usersCol, {
                bio: "",
                avatarUrl: arrayListImages[randomIndex],
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                fullname: `${data.lastname} ${data.firstname}`,
                username: data.username,
                password: values.password,
                friend: [],
                block: [],
              });
              messageApi.open({
                key,
                type: "success",
                content:
                  "Yeah! You have successfully registered. Please check your email",
                duration: 2,
                onClose: () => {
                  navigate("/login");
                },
              });
            })
            .catch((error) => {
              if (error.code === "auth/email-already-in-use")
                messageApi.open({
                  key,
                  type: "warning",
                  content:
                    "Oops! You have error registered. Email already in use",
                  duration: 2,
                  onClose: () => {
                    onPrev();
                  },
                });
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
    } else {
      messageApi.open({
        key,
        type: "warning",
        content: "Oops! user name has been used!",
        duration: 2,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <form
        className={formStep === 2 ? "showForm" : "hideForm"}
        onSubmit={handleSubmit(onSubmit)}
        action=""
        method="post"
      >
        <div className="input-sign">
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
            handleChange={changeBoder2}
            type={passwordShown ? "text" : "password"}
            register={{
              ...register("password"),
            }}
          />
          <FontAwesomeIcon
            onClick={() => togglePassword(true)}
            className="icon"
            icon={passwordShown ? faEyeSlash : faEye}
          />
          <p className="errorText">{errors.password?.message}</p>

          <InputComponents
            children="Confirm Password"
            placeholder="Enter your confirm password"
            customStyle={
              errors.ConfirmPassword
                ? "passError"
                : value !== ""
                ? "pass success "
                : "pass"
            }
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
        <div className="btnSignup">
          <button onClick={onPrev} type="button">
            PREV
          </button>
          <button>REGISTER</button>
        </div>
        <span className="line-continue"></span>
      </form>
    </>
  );
};

export default Step3;
