import React, {useContext} from "react";
import { PostContext } from "../context";
import axios from "axios";
import {NotificationManager} from 'react-notifications';

export default function AddUser () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;

  const addUser = async (e) => {
    const data = {
      email: postData.email,
      username: postData.username,
      oldEmail: postData.oldEmail
    }
    if(postData.isEditingUser) {
      await axios.post('/user/update', data).then((res)=> {
        if(res.data.type === 'success') {
          NotificationManager.success(res.data.message, "", 3000);
          setPostData({
            ...postData,
            isEditingUser: false
          });
        } else NotificationManager.error(res.data.message, "", 3000);
      });
    }
    else {
      await axios.post('/user/create', data).then((res)=> {
        if(res.data.type === 'success') NotificationManager.success(res.data.message, "", 3000);
        else NotificationManager.error(res.data.message, "", 3000);
      });
    }
  };

  const handleChange = e => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5 font-grotesk">
      <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl md:w-1/2 overflow-hidden" >
        <div className="py-10 px-5 md:px-10">
          <div className="text-center mb-10">
            <h1 className="font-bold text-3xl text-gray-900" >{postData.isEditingUser ? 'Edit' : 'Add'} User</h1>
            <p >Enter email and username</p>
          </div>
          <div>
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Username</label>
              <input className="text-base p-2 border-2 border-gray-200 focus:border-indigo-500 rounded-lg focus:outline-none " type="text" name="username"  onChange={handleChange} value={postData.username}/>
              <label className="text-left text-sm font-bold text-gray-500 tracking-wide" >Email</label>
              <input className="text-base p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"  type="text" name="email"  onChange={handleChange} value={postData.email}/>
            </div>
            <div className="flex -mx-3">
              <div className="w-full px-3 mt-9 mb-5">
                <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"  onClick={addUser}>{postData.isEditingUser ? 'Update': 'Submit'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
