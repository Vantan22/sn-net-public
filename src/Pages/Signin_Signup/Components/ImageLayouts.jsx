import React from "react";

const ImageLayout = (props) => {
  const { children, img, customStyle, classname } = props;
  return (
    <div className={classname}>
      <img src={img} alt="" />
      <p className={customStyle}>{children}</p>
    </div>
  );
};

export default ImageLayout;
