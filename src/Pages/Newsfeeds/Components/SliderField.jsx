import React, { useContext, useEffect, useState } from "react";

import { Slider } from "@mui/material";
import { FilterContext } from "../CreatePost/Createpost";


const SliderField = ({ slide }) => {

  const { label, defaultValue, field } = slide;
  const [value, setValue] = useState(defaultValue);
  const { customFilter, setCustomFilter } = useContext(FilterContext);
  const handleSliderValue = (e) => setValue(e.target.value);
  useEffect(() => {
    setCustomFilter({
      ...customFilter,
      [field]: value,
    });
  }, [value]);
  return (
    <div className="SliderField">
      <span className="SliderField-label">{label}</span>
      <Slider
        size="small"
        valueLabelDisplay="auto"
        value={value}
        onChange={handleSliderValue}
        max={200}
      ></Slider>
    </div>
  );
};

export default SliderField;
