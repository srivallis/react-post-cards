import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import { PostContext } from "../context";
import axios from "axios";
import {NotificationManager} from 'react-notifications';

export default function ActiveUsers () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;

  const editUser = async (email, username, e) => {
    setPostData({
      ...postData,
      email: email,
      username: username,
      isEditingUser: true,
      oldEmail: email
    });
  };

  const deleteUser = async (email, e) => {
    const data = {
      'email': email
    };
    await axios.post('/user/delete', data).then((res) =>{
      if(res.data.type === 'success'){
        const index = postData.users.findIndex((user) => user.email === email);
        postData.users.splice(index, 1);
        setPostData({
          ...postData
        });
        NotificationManager.success("User has been deleted !", "", 3000);
      } else NotificationManager.error(res.data.message, "", 3000);
    });
  }

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 font-sans overflow-hidden font-grotesk">
      <div className="w-full lg:w-5/6 mx-auto">
        <h3 className="pt-8 text-yellow-600 text-3xl font-title font-extrabold mb-2" >Active Users</h3>
        <p className="text-yellow-600 mb-10" >Use the action icons to edit/delete the user !</p>
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white uppercase xs:text-xs text-md leading-normal">
                <th className="py-3 px-6 text-left" >Email</th>
                <th className="py-3 px-6 text-center" >Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-xs md:text-sm font-light">
              {Object.values(postData.users).map((user) =>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 md:px-6 px-3 text-left">
                  <div className="flex items-center">
                    <span >{user.email}</span>
                  </div>
                </td>
                <td className="py-3 md:px-6 px-3 text-center">
                  <div className="flex item-center justify-center">
                    <Link to="/admin/add-user" className="w-4 mr-4 transform text-green-500 hover:scale-110 cursor-pointer" onClick={editUser.bind(this, user.email, user.username)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </Link>
                    <div className="w-4 mr-2 transform text-red-500 hover:scale-110 cursor-pointer" onClick={deleteUser.bind(this, user.email)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </div>
                  </div>
                  </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
