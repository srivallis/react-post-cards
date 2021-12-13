import React, {useContext} from "react";
import { PostContext } from "../context";
import axios from "axios";
import {NotificationManager} from 'react-notifications';

export default function Section () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;

  const handleInput = e => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
      isEditingSection: true
    });
  };

  const editSection = async(e) => {
    const data = {
      heading: postData.heading,
      subtext: postData.subtext
    };

    await axios.post('/section/update', data).then((res)=> {
      if (res.data.type === 'success') {
        NotificationManager.success("Section Updated ! ", "", 3000);
        setPostData({
          ...postData,
          isEditingSection: false
        })
      } else NotificationManager.error(res.data.message, "", 3000);
    });
  }

  return (
    <div className="container mx-auto bg-gray-900 text-white min-h-screen items-center py-5 font-grotesk">
      <h3 className="pt-8 text-yellow-600 text-3xl font-title font-extrabold mb-14" >Click the text to edit the content !</h3>
      <textarea type="text" className="w-2/3 p-2 text-center mx-auto xl:text-3xl text-base font-title font-extrabold bg-transparent border border-transparent focus:outline-none focus:border-white cursor-pointer" onInputCapture={handleInput}  name="heading" value={postData.heading}></textarea>
      <textarea type="text"  className="w-2/3 p-2 text-center mx-auto xl:text-xl text-xs font-extralight bg-transparent border border-transparent focus:outline-none focus:border-white cursor-pointer" onInputCapture={handleInput}  name="subtext" value={postData.subtext}></textarea>
      <button className={"block w-1/2 max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 mt-10 font-semibold " + (postData.isEditingSection ? 'opacity-100': 'opacity-0')} onClick={editSection} >Submit</button>
    </div>
  )
}
