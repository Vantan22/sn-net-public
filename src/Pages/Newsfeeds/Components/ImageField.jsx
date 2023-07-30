import { InboxOutlined } from "@ant-design/icons";
import React, { useContext, useEffect } from "react";
import icon_trash from "../../../img/trashdelete_icon.svg";

import { FilterContext } from "../CreatePost/Createpost";
import "../css/instagram.css";

const ImageField = ({ step }) => {
  const {
    filterClass,
    customFilter,
    tab,
    imgResultRef,
    imageFile,
    SetimageFile,
  } = useContext(FilterContext);

  const handleImageChange = (e) => {
    SetimageFile(URL.createObjectURL(e.target.files[0]));
  };
  //  hàm này sử dụng adjusments về sau sẽ dùng.
  const styled = {
    filter: `contrast(${customFilter.contrast}%) brightness(${customFilter.brightness}%) saturate(${customFilter.saturate}%) sepia(${customFilter.sepia}%) grayscale(${customFilter.grayscale}%)`,
  };


  const ImageShow = () => {
    return (
      <img
        // style={styled}
        src={imageFile}
        alt=""
        accept="image/*"
        className={`CreatePost-Images-images ${filterClass}`}
        ref={imgResultRef}
      />
    );
  };
  useEffect(() => {
    ImageShow();
  }, [tab]);
  return (
    <div className="CreatePost-Images">
      {imageFile === null ? (
        <label className="CreatePost-Images-input-label" htmlFor="inputImages">
          <InboxOutlined className="input-icon" />
          <span className="input-label-text">Choose Image</span>
          <input
            id="inputImages"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      ) : (
        <ImageShow />
      )}
      {imageFile !== null && step === 0 ? (
        <div
          className="CreatePost-Images-delete-icon"
          onClick={() => {
            SetimageFile(null);
          }}
        >
          <img src={icon_trash} alt="" className="icon" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ImageField;
