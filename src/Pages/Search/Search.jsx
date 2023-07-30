import React, { useState, useEffect, useRef } from 'react';
import icon_search from '../../img/Groupsearch_close.svg'
import './Search.css'
import user from '../../data/data.js'
import UserRecentItem from '../../Components/UserRecentItem.jsx'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../Api/firebase'

const Search = ({ defaultMenu }) => {
  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchUser, setSearchUser] = useState([]);
  const [state, setState] = useState({ query: '', list: [] })
  const currentId = localStorage.getItem("ID")
  const getData = async () => {
    const searchUser = collection(db, "users");
    const snapshot = await getDocs(searchUser);
    setSearchUser(
      snapshot.docs
        .map((doc) => ({
          id: doc.id,
          userName: doc.data().fullname,
          avatarUrl: doc.data().avatarUrl,
        }))
        .filter((doc) => doc.id !== currentId)
    );
  };
  const handleChange = (e) => {
    const results = searchUser.filter(user => {
      if (e.target.value === "") return searchUser
      return user.userName.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setState({
      query: e.target.value,
      list: results
    })
  }
  useEffect(() => {
    getData();
  }, []);
  const clearInput = () => {
    inputRef.current.value = ''
    setState(
      { query: '', list: [] }
    )
  }

  if (defaultMenu) return null;
  
  else
    return (

      <div className='search'>
        <div className="search-header">
          <h2>Search</h2>
          <form className="input">
            <input type="text" placeholder="Search" ref={inputRef} value={state.query} onChange={handleChange} />
            <img onClick={clearInput} src={icon_search} alt="icon Search" /></form>
        </div>
        <hr style={{ color: '#42D392', width: '100%', height: '1px' }} />
        <main className="search-main">
          <div className="search-top">
            {/* <span className='search-top__Recent'>Recent</span>
                            <span className='search-top__Clear'>Clear all</span> */}
          </div>
          <div className="search-content-user">

            {(state.query === '' ? "" : state.list.map(user => {
              return <UserRecentItem idUser={user.id} key={user.id} userAvatar={user.avatarUrl} userName={user.userName} />
            }))}

          </div>
        </main>
      </div>

    );
};

export default Search;
