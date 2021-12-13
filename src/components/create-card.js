import React, { useContext } from "react";
import axios from "axios";
import { PostContext } from "../context";

import {NotificationManager} from 'react-notifications';

export default function CardInfo () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;

  const createCard = async (e) => {
    const data = {
      desc: postData.desc,
      url: "/images/" + postData.cardImg.name,
      postUrl: "/images/" + postData.postImg.name,
      title: postData.title,
      color: postData.color,
      oldCard: postData.oldCard
    };
    if (postData.isEditingCard) {
      await axios.post('/card/update', data).then((res)=> {
        if (res.data.type === 'success') {
          NotificationManager.success("Card Updated ! ", "", 3000);
          setPostData({
            ...postData,
            isEditingCard: false
          })
        } else NotificationManager.error(res.data.message, "", 3000);
      });
    } else {
      await axios.post('/card/create', data).then((res)=> {
        if (res.data.type === 'success') {
          NotificationManager.success("Card Created ! Please visit `Active Cards scetion to view it !`", "", 3000);
          setPostData({
            ...postData,
            isEditingCard: false
          });
        } else NotificationManager.error(res.data.message, "", 3000);
      });
    }
  }

  const handleImgChange = async (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.files[0]
    });
    const formData = new FormData();
    formData.append('image',e.target.files[0]);
    await axios.post('/card/upload', formData);
  }

  const handleChange = e => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex items-center justify-center bg-gray-900  py-12 px-4 sm:px-6 lg:px-8 items-center font-grotesk">
      <div className="xl:w-1/2 w-full px-10 border border-grey shadow-lg bg-gray-100 rounded-xl z-10">
        <div className="text-center">
          <h2 className="mt-5 text-3xl font-bold text-gray-900" >
            Card
          </h2>
        </div>
        <div className="mt-8 space-y-3">
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Title</label>
            <input className="text-base p-2 border-2 border-gray-200 focus:border-indigo-500 rounded-lg focus:outline-none focus:border-indigo-500"  onChange={handleChange} value={postData.title} name="title"/>
            <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Color</label>
            <input className="text-base p-2 border-2 border-gray-200 focus:border-indigo-500 rounded-lg focus:outline-none"  onChange={handleChange} value={postData.color} name="color"/>
          </div>
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Card Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-20 p-5 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="cursor-pointer text-gray-500 "><span className="text-sm" >{postData.cardImg && postData.cardImg.name || 'Click here to upload'}</span></p>
                </div>
                <input type="file" name="cardImg" onChange={handleImgChange}/>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Post Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-20 p-5 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="cursor-pointer text-gray-500 "><span className="text-sm" >{postData.postImg && postData.postImg.name || 'Click here to upload'}</span></p>
                </div>
                <input type="file" name="postImg" onChange={handleImgChange} />
              </label>
            </div>
          </div>
          <div>
          <div className="grid grid-cols-1 space-y-2 flex mt-4">
            <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Description</label>
            <textarea className="border-2 border-gray-200 focus:border-indigo-500 h-20  rounded w-full py-2 px-3 mr-4 text-black"  onChange={handleChange} value={postData.desc} name="desc"></textarea>
          </div>
          <button onClick={createCard}  className="my-5 w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-lg tracking-wide font-semibold  focus:outline-none focus:shadow-outline shadow-lg cursor-pointer transition ease-in duration-300">{postData.isEditingCard ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
