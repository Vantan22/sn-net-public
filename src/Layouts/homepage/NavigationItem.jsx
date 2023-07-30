import React from 'react';

const NavigationItem = (props) => {


    return (
        <>
            <img src={props.icon} alt="" className="icon icon-menu" />
            {props.mode ? <span className="text-menu">{props.name}</span> : ("")}
        </>
    );
};

export default NavigationItem;
