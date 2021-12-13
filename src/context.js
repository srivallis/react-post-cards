import React, { createContext, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PostContext = createContext(undefined);

function PostProvider({children}) {

  const location = useLocation();
  const url = window.location.pathname.split('/').pop();

  const [postDetails, setPostData] = useState({
    title: '',
    color: '',
    url: '',
    cardImg: '',
    postImg: '',
    postUrl: '',
    desc: '',
    animateCard: false,
    cards: [],
    users: [],
    sender: '',
    receiver: '',
    msg: '',
    flipped: false,
    animatePost: false,
    email: '',
    username: '',
    isEditingUser: false,
    isEditingCard: false,
    isEditingSection: false,
    oldEmail: '',
    oldCard: '',
    heading: '',
    subtext: '',
    verifiedUser: false // to check if an user is authorised to update content via dashboard.
  });

  const getCardData = async () => {
    const response = await axios.get('/card/get');
    return response.data.cards;
  };

  const getUserData = async () => {
    const response = await axios.get('/user/get');
    return response.data.users;
  };

  const getSectionData = async () => {
    const response = await axios.get('/section/get');
    return response.data.section[0];
  };

  // this api (/verify/) needs to be called (i.e getUserStatus function) in useEffect hook along with the other api calls, if we use any authentication procedure like google SSO. Refer `routes/admin.js` file for more details.
  // Example:::::
  // await Promise.all([getCardData(), getUserData(), getSectionData(), getUserStatus()]).then(([cards, users, section, status]) => {
  //   setPostData({
  //     ...postDetails,
  //     cards: cards,
  //     users: users,
  //     heading: section.heading,
  //     subtext: section.subtext,
  //     verifiedUser: status
  //   })
  // }).catch(e => console.log('Error fetching data from DB', e));
  
  const getUserStatus = async () => {
    const response = await axios.get('/verify/');
    return response.data.success;
  };

  useEffect(async() => {
    await Promise.all([getCardData(), getUserData(), getSectionData()]).then(([cards, users, section]) => {
      setPostData({
        ...postDetails,
        cards: cards,
        users: users,
        heading: section.heading,
        subtext: section.subtext
      })
    }).catch(e => console.log('Error fetching data from DB', e));
    }, [location, url]);

  return (
    <PostContext.Provider value={{post: [postDetails, setPostData]}}>
      {children}
    </PostContext.Provider>
  )
}

export {
  PostProvider,
  PostContext
};
