import React, { useContext, useState } from "react";
import { Tabs } from "antd";

import FilterField from "../../Components/FilterField";
import SliderField from "../../Components/SliderField";

import { FILTER_VALUES, DEFAULT_VALUES } from "../../constant/DEFAULT_OPTIONS";
import { FilterContext } from "../Createpost";
const SecondStep = () => {
  const { customFilter, filterClass, setTab, SetFilterClass, imgResultRef } =
    useContext(FilterContext);
  const handleReset = () => {
    SetFilterClass("");
  };
  const handle = (e) => {
    setTab(e);
  };
  return (
    <div className="CreatePost-SecondStep">
      <div className="CreatePost-SecondStep-config">
        <Tabs
          // centered={true}
          tabPosition="top"
          className="max-width"
          onChange={handle}
          defaultActiveKey="1"
          items={[0].map((Icon, i) => {
            const id = String(i + 1);

            if (id == 1) {
              return {
                label: <span className="textGridPost">Filter</span>,
                key: id,
                children: (
                  <div className="Filter">
                    <span
                      className={
                        filterClass === ""
                          ? "btn-resetFilter"
                          : "btn-resetFilter active"
                      }
                      onClick={handleReset}
                    >
                      Reset
                    </span>
                    {FILTER_VALUES.map((values, i) => (
                      <FilterField key={i} values={values} />
                    ))}{" "}
                  </div>
                ),
              };
            } else {
              return {
                label: <span className="textShortVideo">Adjustments</span>,
                key: id,
                children: (
                  <div className="">
                    {DEFAULT_VALUES.map((slide, i) => (
                      <SliderField slide={slide} key={i} />
                    ))}{" "}
                  </div>
                ),
              };
            }
          })}
        />
      </div>
    </div>
  );
};

export default SecondStep;
