import { yupResolver } from "@hookform/resolvers/yup";
import { Input, message } from "antd";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import icon_pencil from "../../../img/PostPersonalInformation/edit-03.png";
import icon_setting from "../../../img/PostPersonalInformation/vuesax/linear/setting-2.png";
import "./EditProfile.css";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useForm } from "react-hook-form";
import { db, storage } from "../../../Api/firebase";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { TextArea } = Input;
const EditProfile = (props) => {
  
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const [valueBio, setValueBio] = useState("");
  const [defaultValues, setDefaultValues] = useState({});
  const { id } = useParams();
  const [passwordShown, setPasswordShown] = useState(false);

  const [valueUserName, setValueUserName] = useState("");
  const [valueFistName, setValueFistName] = useState("");
  const [valueLastName, setValueLastName] = useState("");
  const [valueEmail, setValueEmailName] = useState("");
  const [valuePassword, setValuePassword] = useState("");

  const [imgChange, setImgChange] = useState("")
  const [showInput, setShowInput] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null);
  const [defaultImg, setDefaultImg] = useState(null)


  useEffect(() => {
    onSnapshot(doc(db, "users", id), (doc) => {
      if (doc.exists) {
        const data = doc.data();
        setDefaultValues(data);
        setDefaultImg(doc.data().avatarUrl)
        setImgChange(doc.data().avatarUrl)
        Object.keys(data).forEach((field) => {
          setValue(field, data[field]);
        });
        setValueBio(doc.data().bio);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  //yup
  const schema = yup
    .object({
      password: yup
        .string()
        .required("Please enter a password")
        .matches(/^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/, "Password without accents")
        .min(6, "Enter more than 6 characters")
        .trim(),
      username: yup
        .string()
        .required("Please enter a username")
        .matches(/^[a-zA-Z0-9._]+$/, "Username without accents")
        .min(6, "Enter more than 6 characters"),
      firstname: yup
        .string()
        .required("Please enter Firts Name")
        .matches(/\D/i, "Wrong format, not write number"),
      lastname: yup
        .string()
        .required("Please enter Last Name")
        .matches(/\D/i, "Wrong format, not write number"),
      email: yup
        .string()
        .email("Enter the wrong email format")
        .required("Please enter Email"),
    })
    .required();

  const { register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all", resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });

    const userRef = doc(collection(db, "users"), id);
    Object.keys(values).forEach((field) => {
      // Kiểm tra nếu giá trị là chuỗi thì gọi phương thức `.trim()`
      if (typeof values[field] === "string") {
        values[field] = values[field].trim();
      }
      // Kiểm tra giá trị mới của trường dữ liệu có khác giá trị ban đầu không
      // Nếu giá trị mới là trống, gán lại giá trị của `defaultValues`
      if (values[field] === "") {
        values[field] = defaultValues[field];
      }
    });

    // Chọn file người dùng chọn
    const file = selectedImg;
    if (file !== null) {
      const imgRef = ref(storage, `image/${file.name}`)
      const uploadTask = uploadBytesResumable(imgRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgChange(downloadURL)
            updateDoc(userRef, {
              avatarUrl: downloadURL
            });
          });
        }
      );
    } else {
      setImgChange(defaultImg);
    }
    // Thực hiện xử lý submit dữ liệu lên Firebase hoặc các bước xử lý khác
    // ...
    await updateDoc(userRef, {
      bio: valueBio,
      avatarUrl: imgChange,
      email: values.email,
      firstname: values.firstname,
      lastname: values.lastname,
      fullname: `${values.lastname} ${values.firstname}`,
      password: values.password,
      username: values.username,
    }).then(() => {
      setTimeout(() => {
        messageApi.open({
          key,
          type: "success",
          content: "Update Profile Successfully",
          duration: 1,
        }).then(() => {
            props.handleModal(false)
        });
       
      } , 2000);

     
    });
  }
  // Hàm xử lí khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImg(file);
    setDefaultImg(URL.createObjectURL(file))
  }
const togglePassword = ()=> {
  setPasswordShown(!passwordShown)
}
  return (
    <>
      {contextHolder}

      <div id="EditProfile">
        <form
          className="container"
          onSubmit={handleSubmit(onSubmit)}
          method="post"
        >
          <header>
            <img src={icon_setting} alt="" className="icon " />
            <h2>Edit profile</h2>
          </header>
          <main>
            <div className="EditProfile-AvatarUser">
              <img src={defaultImg} alt="" />

              {showInput && (
                <label className="input-labelProfile" htmlFor="inputImage">
                  <input id="inputImage" type="file" onChange={handleImageChange} />
                  <div className="icon pencil" >
                    <img
                      src={icon_pencil}
                      alt=""
                    />
                  </div>
                </label>

              )}

            </div>
            <div className="EditProfile-infomation">
              <div className="EditProfile-infomation-bio">
                <label htmlFor="Bio">Bio</label>
                <TextArea
                  showCount
                  styles={{ height: "60px" }}
                  maxLength="150"
                  id="Bio"
                  value={valueBio}
                  onChange={(e) => {
                    setValueBio(e.target.value);
                  }}
                  //   placeholder="Autosize height with minimum and maximum number of lines"
                  autoSize={{
                    minRows: 2,
                    maxRows: 3,
                  }}
                />
              </div>
              <div className="Edit EditProfile-infomation-username">
                <div>
                  <label className="EditLabel" htmlFor="UserName">
                    UserName
                  </label>
                  <input
                    // onChange={handleInputUserNameChange}
                    {...register("username")}
                    type="text"
                    id="UserName"
                    defaultValue={defaultValues.username}
                    // title="Ít nhất 3 kí tự, không có kí tự đặc biệt"
                    className={
                      // errorUserName
                      errors.username
                        ? "EditInput error"
                        : valueUserName !== ""
                        ? "EditInput success"
                        :"EditInput"
                    }

                  />
                  <p className="errorText">{errors.username?.message}</p>
                </div>
              </div>
              <div className="Edit EditFullName">
                <div className=" EditProfile-infomation-FirstName">
                  <div>
                    <label className="EditLabel" htmlFor="FirstName">
                      FirstName
                    </label>
                    <input
                      {...register("firstname")}
                      // onChange={handleInputFirstNameChange}
                      defaultValue={defaultValues.firstname}
                      type="text"
                      id="FirstName"
                      title="Ít nhất 3 kí tự, không có kí tự đặc biệt"
                      className={
                        errors.firstname
                          ? "EditInput error"
                          : valueFistName !== ""
                          ? "EditInput success"
                          : "EditInput"
                      }

                    />
                    <p className="errorText">{errors.firstname?.message}</p>
                  </div>
                  
                </div>
                <div className=" EditProfile-infomation-LastName">
                  <div>
                    <label className="EditLabel" htmlFor="LastName">
                      LastName
                    </label>
                    <input
                      {...register("lastname")}
                      defaultValue={defaultValues.lastname}
                      // onChange={handleInputLastNameChange}
                      type="text"
                      id="LastName"
                      className={
                        errors.lastname
                          ? "EditInput error"
                          : valueLastName !== ""
                            ? "EditInput success"
                            : "EditInput"
                      }

                    />
                    <p className="errorText">{errors.lastname?.message}</p>
                  </div>
                  
                </div>
              </div>
              <div className="Edit EditProfile-infomation-Email">
                <div>
                  <label className="EditLabel" htmlFor="Email">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    defaultValue={defaultValues.email}
                    // onChange={handleInputEmailChange}
                    type="text"
                    id="Email"
                    title="Ít nhất 3 kí tự, không có kí tự đặc biệt"
                    className={
                      errors.email
                        ? "EditInput error"
                        : valueEmail !== ""
                          ? "EditInput success"
                          : "EditInput"
                    }

                  />
                  <p className="errorText">{errors.email?.message}</p>
                </div>
                
              </div>
              <div className="Edit EditProfile-infomation-Password">
                <div>
                  <label className="EditLabel" htmlFor="Password">
                    Password
                    <input
                      {...register("password")}
                      defaultValue={defaultValues.password}
                      // onChange={handleInputPasswordChange}
                      type={!passwordShown ? 'password' : 'text' }
                      id="Password"
                      className={
                        errors.password
                          ? "EditInput error"
                          : valuePassword !== ""
                            ? "EditInput success"
                            : "EditInput"
                      }
                    />
                    <FontAwesomeIcon
                      onClick={() => togglePassword(true)}
                      className="icon icon-pass-edit-profile"
                      icon={passwordShown ? faEyeSlash : faEye}
                    />
                  </label>

                </div>
                <p className="errorText">{errors.password?.message}</p>

              </div>
              <div className="footer-btn">
                <div
                  onClick={() => {
                    props.handleModal(false);
                  }}
                >
                  Cancel
                </div>
                <button
                >Save</button>
              </div>
            </div>
          </main>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
