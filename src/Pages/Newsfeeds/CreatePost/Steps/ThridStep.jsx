import React, { useContext } from "react";

import TextArea from "antd/es/input/TextArea";
import { FilterContext } from "../Createpost";

const ThridStep = () => {
  const { userData, setinputData } = useContext(FilterContext);
  const handleInputValue = (e) => {
    setinputData(e.target.value);
  };
  return (
    <div className="CreatePost-ThridStep">
      <div className="CreatePost-ThridStep-config">
        <div className="modal-create-post-content-addinfo">
          <div className="user_create">
            <img src={userData.avatarUrl} alt="" />
            <span className="user_create-name">{userData.fullname}</span>
          </div>
          <div className="user_input">
            <TextArea
              className="user_input__input"
              placeholder="Write a caption ..."
              autoSize={{
                minRows: 2,
                maxRows: 6,
              }}
              maxLength="2500"
              bordered={false}
              showCount
              onChange={handleInputValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThridStep;
