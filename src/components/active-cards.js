import {Link} from 'react-router-dom';
import React, {useContext} from "react";
import {PostContext} from '../context';
import axios from "axios";
import {NotificationManager} from 'react-notifications';


export default function ActiveCards (props) {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;

  const editCard = async (card, e) => {
    setPostData({
      ...postData,
      title: card.title,
      color: card.color,
      desc: card.desc,
      url: card.url,
      postUrl: card.postUrl,
      cardImg: {
        name: card.url.split('/')[card.url.split('/').length-1]
      },
      postImg: {
        name: card.postUrl.split('/')[card.postUrl.split('/').length-1]
      },
      isEditingCard: true,
      oldCard: card._id
    });
  };

  const deleteCard = async (id, e) => {
    const data = {
      '_id': id
    };
    await axios.post('/card/delete', data).then((res) =>{
      if(res.data.type === 'success'){
        const index = postData.cards.findIndex((card) => card._id === id);
        postData.cards.splice(index, 1);
        setPostData({
          ...postData
        });
        NotificationManager.success("Card has been deleted !", "", 3000);
      } else NotificationManager.error(res.data.message, "", 3000);
    });
  }

	return (
      <div className="bg-gray-900 min-h-screen py-5 px-10 md:px-20 font-grotesk">
        <h3 className="text-yellow-600 text-3xl font-title font-extrabold mb-10" >Hover over to Edit/Delete the card !</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-10 lg:gap-x-5 md:gap-x-10 xl-grid-cols-4 gap-y-10 gap-x-6 ">
          {
            postData && Object.values(postData.cards).map((card) =>
              <div className={"p-5 group bg-white relative mx-auto border border-grey shadow-lg rounded-lg max-w-md  hover:shadow-2xl transition duration-300 "} >
                <img src={process.env.PUBLIC_URL + card.url} alt="" className="rounded-t-lg w-full" />
                <h1 className="md:text-1xl text-xl font-bold text-gray-900 " >{card.title}</h1>
                <div className="absolute z-20 top-2/4 left-1/3  flex opacity-0 group-hover:opacity-100">
                  <Link to="/admin/create-card" class=" w-8 h-8 mr-4 ml-4 mb-2 transform  hover:scale-110 text-green-900 cursor-pointer flex" onClick={editCard.bind(this, card)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </Link>
                  <div class=" w-8 h-8 mr-2 mb-2 transform   text-red-900 hover:scale-110 cursor-pointer flex" onClick={deleteCard.bind(this, card._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </div>
                </div>
                <div class="z-10 absolute inset-0 w-full rounded opacity-0 group-hover:opacity-100 h-full bg-gradient-to-bl from-transparent via-gray-200 to-transparent ..."></div>
              </div>
            )
          }
        </div>
		  </div>
	)
};
