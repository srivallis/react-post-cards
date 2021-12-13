import {Link} from 'react-router-dom';
import React, {useContext} from "react";
import {PostContext} from '../context';

export default function Card () {
  const {post}= useContext(PostContext);
  const [postData] = post;
	return (
      <div className="bg-white-100 py-5 md:pt-20 px-10 md:px-20 tracking-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:gap-x-10 lg:gap-x-5 md:gap-x-10 xl-grid-cols-4 gap-y-10 gap-x-6 ">
          {
            Object.values(postData.cards).map(({title, url, color, postUrl, desc}) =>
              <Link to={'/cards/'+title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z\-]/g, '')} className={"p-5 bg-white mx-auto border shadow-lg rounded-lg max-w-md hover:shadow-2xl transition duration-300 transform transition duration-500 hover:scale-110"}>
                <img src={process.env.PUBLIC_URL + url} alt="" className="rounded-t-lg w-full aspect-ratio-square" />
                <h1 className="md:text-1xl mt-4 text-lg transition duration-200  font-semibold text-gray-600 font-grotesk" >{title}</h1>
              </Link>
            )
          }
        </div>
		  </div>
	)
};
