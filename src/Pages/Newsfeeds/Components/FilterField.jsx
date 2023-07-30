import React, { useContext } from "react";
import { FilterContext } from "../CreatePost/Createpost";


const FilterField = ({ values }) => {
  const {filterClass, SetFilterClass} = useContext(FilterContext);

  const handleClickFilter = () => {
    SetFilterClass(values.class);
  };
  return (
    <div className="FilterFrield" onClick={handleClickFilter}>
      <img
        src="https://images.unsplash.com/photo-1616493964757-9385040e32f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
        alt=""
        className={`FilterFrield-image ${values.class}`}
      />
      <span className="FilterFrield-desc">{values.name}</span>
    </div>
  );
};

export default FilterField;
