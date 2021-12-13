import React, {useContext} from 'react';
import Card from './card';
import { PostContext } from "../context";


export default function Home () {
  const {post} = useContext(PostContext);
  const [postData] = post;

  return (
    <div className="flex flex-wrap flex-col justify-center items-center min-h-screen lg:my-0 my-8">
      <header className="px-10 md:px-20 font-grotesk w-full">
        <h1 className="text-left md:text-center text-gray-800 block text-3xl font-bold font-title tracking-wide">{postData.heading}</h1>
        <p className="text-left md:text-center text-gray-800 w-full xl:w-2/3 mx-auto mt-5 text-xl font-normal tracking-wide">{postData.subtext}</p>
        <p className="text-left md:text-center text-gray-800 w-full xl:w-2/3 mx-auto text-xl font-normal tracking-wide">"Psst! Want to know a secret?" You can <a href='/admin/create-card' className="text-yellow-600 hover:text-blue">create</a> your own card here !</p>
      </header>
      <Card/>
    </div>
  )
};
