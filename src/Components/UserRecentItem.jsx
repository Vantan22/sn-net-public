import React from 'react';
import { Link } from 'react-router-dom';
import icon_delete from '../img/GroupdleteUserRecents.svg'
import './UserRecentItem.css'
import { MenuStateContext } from '../Layouts/homepage/HomePage';
import { useContext } from 'react';
const UserRecentItem = (props) => {
    const {
        menuState,
        setMenuCollapsed,
        setMenuState,
    } = useContext(MenuStateContext)
    const handleClickSearchCollapse = () => {
        setMenuCollapsed(true)
        setMenuState({

            ...menuState,
            searchCollapsed: false,

        })
    }
    return (
        <Link to={`/Profile/${props.idUser}`} className='user-recent' onClick={handleClickSearchCollapse}>
        {/* <div className='padding'> */}

            <div className="user">
                <img src={props.userAvatar} alt={props.userName} />
                <span>{props.userName}</span>
            </div>
            <div>
            {/* <img className='user-recent-close' src={icon_delete} alt="icondelete" /> */}
            </div>
        {/* </div> */}
        </Link>
    );
};

export default UserRecentItem;
