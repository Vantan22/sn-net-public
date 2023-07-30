import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MenuStateContext } from '../Layouts/homepage/HomePage';

const NotiItem = (props) => {
    const {
        setMenuCollapsed,
        setMenuState,
    } = useContext(MenuStateContext)
    const handleClickNotiCollapse = () => {
        setMenuCollapsed(true)
        setMenuState({

            notificationCollapsed: false,
            searchCollapsed: false,

        })
    }
    return (
        <Link to={props.param} onClick={handleClickNotiCollapse}>
            <div className='noti-item'>
                <img src={props.avatar} alt={props.userName} />
                <span><span className='noti-username'>{props.userName} </span>{props.notidesc} </span>
            </div>
        </Link>
    );
};

export default NotiItem;
