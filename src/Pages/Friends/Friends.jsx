import React from 'react';
import icon_Friend from '../../img/vuesax/linear/friends.svg'
import icon_Suggester from '../../img/vuesax/linear/suggestions.svg'
import icon_friendRequest from '../../img/vuesax/linear/Friend_request.svg'
import icon_home from "../../img/vuesax/linear/home.svg"
import "./css/Friends.css"
import { Link, Outlet } from 'react-router-dom';

const Friends = () => {
   
    return (
        <div className='wrap_Friend'>
            <div className="flex-center wrapper_menuFriend ">
                <Link to="/Friends">
                    <div className="flex-center item_menuFriend">
                        <img src={icon_home} alt="" className="icon iconHomeFriend iconFriends " />
                        <span className='text_item_menuFriend'>Home</span>
                    </div>

                </Link>
                <Link to="/Friends/FriendsRequest">
                    <div className="flex-center item_menuFriend ">
                        <img src={icon_friendRequest} alt="" className="icon iconFriendRequest iconFriends " />
                        <span className='text_item_menuFriend'>Friends request</span>
                    </div>
                </Link>
                <Link to="/Friends/Suggestions">
                    <div className="flex-center item_menuFriend">
                        <img src={icon_Suggester} alt="" className="icon iconSuggetions iconFriends " />
                        <span className='text_item_menuFriend'>Suggetions</span>
                    </div>
                </Link>
                <Link to="/Friends/AllFriends">
                    <div className="flex-center item_menuFriend">
                        <img src={icon_Friend} alt="" className="icon iconAllFriend iconFriends " />
                        <span className='text_item_menuFriend'>All friend</span>
                    </div>
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

export default Friends;
