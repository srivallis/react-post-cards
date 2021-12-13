import React, {useState, useContext} from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import CreateCard from './create-card';
import ActiveUsers from './active-users';
import Section from './section';
import AddUser from './add-user';
import ActiveCards from './active-cards';
import { PostContext } from "../context";


export default function Admin () {
  const [data, setData] = useState([false, false]);
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;
  const toggleDrodownClick = (num, e) => {
    const newItemsArr = [...data]
    const array = newItemsArr.map((item,index) => {
    return index === num ? (!data[index]) : false
    });
    setData(array);
  }

  const editState = e => {
    setPostData({
      ...postData,
      email: '',
      username: '',
      isEditingUser: false
    })
  };

  const editCardState = e => {
    setPostData({
      ...postData,
      title: '',
      url: '',
      desc: '',
      color: '',
      postUrl:'',
      cardImg: '',
      postImg: '',
      isEditingCard: false
    })
  };

  const editSectionState = e => {
    setPostData({
      ...postData,
      isEditingSection: false
    })
  };

  return (
    <div>
      {/* (postData.verifiedUser || (!postData.verifiedUser && postData.cards.length === 0) ) */}
      <Router>
        <div className="admin-page md:flex flex-row min-h-screen font-grotesk">
          <div className="md:flex bg-gray-800  flex-row min-h-screen">
            <div className="flex flex-col w-full md:w-64 text-gray-700 bg-gray-800 flex-shrink-0" >
              <div className="flex-shrink-0 px-8 py-8 flex flex-row items-center justify-between">
                <div to="/admin" className="text-lg font-semibold tracking-widest uppercase border-l-4 border-transparent hover:border-gray-800   focus:outline-none focus:shadow-outline text-white" >Dashboard</div>
                <button className="border-l-4 border-transparent hover:border-gray-800   md:hidden border-l-4 border-transparent hover:border-gray-800   focus:outline-none focus:shadow-outline" >
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                    <path  fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                    <path  fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
              <nav className="flex-grow md:block pb-4 md:pb-0 md:overflow-y-auto">
                {/* <div className="cursor-pointer">
                  <a onClick={toggleDrodownClick.bind(this, 0)} data-id="0" className="flex flex-row block pl-2 pr-4 py-4 font-semibold bg-transparent border-l-4 border-transparent hover:border-gray-800  hover:bg-gray-600 focus:bg-gray-600 text-white focus:text-grey-200 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    <span className="inline-flex justify-center items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    <span className="ml-2 text-xl  tracking-wide truncate" >Users</span>
                    <svg fill="currentColor" viewBox="0 0 20 20"  className={"inline w-4 h-4 xl:mt-2 ml-auto transition-transform duration-200 transform md:-mt-1 " + (!data[0] ? "rotate-0" : "rotate-180")}><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  </a>
                  <div className={"border block border-gray-700 w-full bg-white shadow " + (!data[0]? "hidden" : "")}>
                    <Link to="/admin/add-user" className={"border border-b border-gray-200 text-left block pl-10 pr-4 py-4 mat-2 text-sm font-semibold md:mt-0 focus:bg-gray-200 focus:text-yellow-600 focus:outline-none focus:shadow-outline " + (postData.isEditingUser ? 'text-yellow-600 bg-gray-200' : 'text-gray-700 bg-transparent')}  onClick={editState}>{postData.isEditingUser ? 'Edit' : 'Add'} User</Link>
                    <Link to="/admin/active-users" className="text-left block pl-10 pr-4 py-4 mat-2 text-sm font-semibold bg-transparent md:mt-0 focus:bg-gray-200 focus:text-yellow-600 focus:outline-none focus:shadow-outline"  onClick={editState}>Active Users</Link>
                    </div>
                </div> */}
                <div className="cursor-pointer">
                  <a onClick={toggleDrodownClick.bind(this, 1)} data-id="0" className="flex flex-row block pl-2 pr-4 py-4 font-semibold bg-transparent border-l-4 border-transparent hover:border-gray-800  hover:bg-gray-600 focus:bg-gray-600 text-white focus:text-grey-200 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    <span className="inline-flex justify-center items-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    </span>
                    <span className="ml-2 text-xl  tracking-wide truncate" >Cards</span>
                    <svg fill="currentColor" viewBox="0 0 20 20"  className={"inline w-4 h-4 xl:mt-2 ml-auto transition-transform duration-200 transform md:-mt-1 " + (!data[1] ? "rotate-0" : "rotate-180")}><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                  </a>
                  <div className={"border block border-gray-700 w-full bg-white shadow " + (!data[1]? "hidden" : "")}>
                    <Link to="/admin/create-card" className={"border border-b border-gray-200 text-left block pl-10 pr-4 py-4 mat-2 text-sm font-semibold md:mt-0 focus:bg-gray-200 focus:text-yellow-600 focus:outline-none focus:shadow-outline " + (postData.isEditingCard ? 'text-yellow-600 bg-gray-200' : 'text-gray-700 bg-transparent')}  onClick={editCardState}>{postData.isEditingCard ? 'Edit': 'Create'} Card</Link>
                    <Link to="/admin/active-cards" className="text-left block pl-10 pr-4 py-4 mat-2 text-sm font-semibold bg-transparent md:mt-0 focus:bg-gray-200 focus:text-yellow-600 focus:outline-none focus:shadow-outline"  onClick={editCardState}>Active Cards</Link>
                    </div>
                </div>
                <div className="cursor-pointer">
                  <Link to="/admin/section" className="flex flex-row block pl-2 pr-4 py-4 font-semibold bg-transparent border-l-4 border-transparent hover:border-gray-800  hover:bg-gray-600 focus:bg-gray-600 text-white focus:text-grey-200 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" onClick={editSectionState}>
                    <span className="inline-flex justify-center items-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                    </span>
                    <span className="ml-2 text-xl  tracking-wide truncate" >Section</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
          <div className="w-full bg-gray-900 min-h-screen max-h-screen overflow-y-scroll">
            <a href="/" className="flex absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#fff"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="ml-2 text-white" >Logout</span>
            </a>
            
              <Route path="/admin/create-card"><CreateCard /></Route>
              <Route path="/admin/active-cards"><ActiveCards /></Route>
              {/* <Route path="/admin/add-user" ><AddUser/></Route>
              <Route path="/admin/active-users"><ActiveUsers /></Route> */}
              <Route path="/admin/section"><Section /></Route>
            
          </div>
        </div>
        </Router>
      {/* : <Redirect to='/' /> } */}
      </div>
  );
}


