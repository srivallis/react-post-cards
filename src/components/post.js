import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import { PostContext } from "../context";
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ReactTooltip from 'react-tooltip';
import _debounce from 'lodash/debounce';

export default function Post() {
  const {post}= useContext(PostContext);
  const [postData, setpostData] = post;
  const { title } = useParams();
  const currentPost = Object.values(postData.cards).find((p) => {
    return p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z\-]/g, '') === title
  });

  const postUrl = currentPost && currentPost.postUrl;
  const handlePrev = e => {
    setpostData({
      ...postData,
      flipped: false,
      msg: "",
      sender: '',
      receiver: '',
      animateCard: true
    })
  };

  const showSuccessNotif = _debounce((msg) => {
    if (document.querySelectorAll(".notification-success").length === 0) {
      NotificationManager.success(msg, "", 500);
    }
  }, 250);

  const loadImage = (url) => {
    return new Promise(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = url;
    });
  }
  const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    var words = text.split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  const generateCornerIcons = async (context, svgElement, left, right, width, height) => {
    let clonedSvgElement = svgElement.cloneNode(true);
    let outerHTML = clonedSvgElement.outerHTML,
    blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    let icon = await loadImage(blobURL);
    context.drawImage(icon, left, right, width, height);
  };

  const generateCanvasFromDiv = async () => {
    let canvas = document.createElement('canvas');
    canvas.id = 'someId';
    canvas.style.width = "1100px";
    canvas.style.height = "600px";
    document.querySelector(".canvas-wrapper").innerHTML = "";
    document.querySelector(".canvas-wrapper").appendChild(canvas);

    let ctx = canvas.getContext("2d");

    let dpr = 2;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#ffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "16px Patrick Hand";
    ctx.fillStyle = "#CACCCF";

    ctx.strokeStyle = "#E8E8E8";
    ctx.fillStyle = "#ffff";
    roundRect(ctx, 50, 50, 1000, 500, 8, true);
    ctx.clip();
    let lineCharacterImage = await loadImage(postUrl);
    ctx.drawImage(lineCharacterImage, 70, 155, 264, 264);
    let logo = await loadImage("/gift.png");
    ctx.drawImage(logo, 980, 480, 45, 45);

    // let svgElement = document.querySelector('.card-icon-top-left');
    // await generateCornerIcons(ctx, svgElement, 50, 50, 120, 120);

    // svgElement = document.querySelector('.card-icon-bottom-left');
    // await generateCornerIcons(ctx, svgElement, 50, 425, 180, 125);

    ctx.font = "700 30px tracking-wide neue-haas-grotesk-display, sans-serif";
    ctx.fillStyle = "#474747";
    ctx.fillText(currentPost.title, 450, 100);


    ctx.font = "25px Patrick Hand";
    ctx.fillStyle = "#52575C";
    ctx.fillText("To", 400, 200);
    wrapText(ctx, postData.msg, 400, 270, 600, 40);
    ctx.fillText("From", 400, 520);

    ctx.font = "28px Patrick Hand";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "bottom";
    ctx.fillText(postData.receiver, 440, 205);
    ctx.fillText(postData.sender, 470, 528);

    ctx.fillStyle = "#DBDDE0";
    let text = ctx.measureText(postData.receiver);
    ctx.fillRect(433, 205, text.width + 20, 2);
    text = ctx.measureText(postData.sender);
    ctx.fillRect(465, 528, text.width + 20, 2);

    return { canvas, ctx };
  }

  const handleCopy = async(e) => {
    const { canvas } = await generateCanvasFromDiv();
    if (window.ClipboardItem) {
      canvas.toBlob(blob => {
        navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
      });
    }
    showSuccessNotif('Card Copied to Clipboard !');
    document.querySelector(".canvas-wrapper").innerHTML = "";
  };

  const handleClick = async(e) => {
    await generateCanvasFromDiv().then(({canvas, ctx}) => {
      let link = document.createElement('a');
      link.className = "hidden";
      link.download = 'card.png';
      link.href = canvas.toDataURL();
      link.click();
      showSuccessNotif('Card Downloaded !');
    }).catch((e) => {
      console.log('canvas error', e);
    });
    document.querySelector(".canvas-wrapper").innerHTML = "";
  };



  return (
    <div className="relative flex min-h-screen flex-col pb-16 justify-center items-center" style={{'background-color': currentPost && currentPost.color}}>
      <div className="canvas-wrapper absolute inset-1/2 opacity-0"></div>
      <Link to='/' className="opacity-0 lg:opacity-100 absolute top-4 left-4" onClick={handlePrev}>
        <svg width="60" height="60" viewBox="0 0 110 110" fill="none" className="" xmlns="http://www.w3.org/2000/svg"><path className="circle" d="M2 55C2 25.729 25.729 2 55 2s53 23.729 53 53-23.729 53-53 53S2 84.271 2 55z" fill="#fff" stroke="#17274E" stroke-width="4"></path><path className="arrow" d="M61.55 73.098L43 54.549 61.55 36" stroke="#17274E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </Link>
      <Link to='/' data-tip="Go Back" className="absolute top-4 left-4 block lg:hidden text-black" onClick={handlePrev}>
        <div class="flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " viewBox="0 0 20 20" fill="#000"><path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
          <span>back</span>
        </div>
      </Link>
      <ReactTooltip />
      <FrontPost />
      <BackPost />
      <div className="grid grid-flow-col grid-cols-2 gap-4 mx-auto mt-auto font-grotesk">
        <svg xmlns="http://www.w3.org/2000/svg"  data-tip="Download" onClick={handleClick} className="block xl:hidden cursor-pointer h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        <button className="hidden xl:block bg-transparent border border-black text-black w-auto hover:text-white hover:bg-black hover:border-black font-bold py-4 px-4 xl:px-16 rounded"  onClick={handleClick}>Download</button>
        <svg xmlns="http://www.w3.org/2000/svg"  data-tip="Copy" onClick={handleCopy} className="block xl:hidden cursor-pointer h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
        <button className="hidden xl:block bg-transparent border border-black text-black hover:text-white hover:bg-black hover:border-black font-bold py-4 px-4 xl:px-16 rounded"  onClick={handleCopy}>Copy To Clipboard</button>
      </div>
    </div>
  )
};

function FrontPost () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;
  const elementRef = useRef();

  const { title } = useParams();
  const currentPost = Object.values(postData.cards).find((p) => {
    return p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z\-]/g, '') === title
  });
  const postUrl = currentPost && currentPost.postUrl;

  const handleChange = e => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  };

  // useEffect(() => {
  //   setData({
  //     ...data,
  //     animatePost: true
  //   });
  // });


  const handleInfoClick = (e) => {
    setPostData({
      ...postData,
      flipped: true
    });
  };

  return (
    <div ref={elementRef} className={"transition duration-500 ease-linear mx-auto w-full grid grid-cols-1 col-auto z-10 front-post absolute transform flex items-center justify-center  px-3 md:px-10 " + (postData.flipped ? "opacity-0 rotate-y-180 " : "opacity-100 rotate-y-0 ") + (postData.animatePost ? 'anim' : '')} style={{'max-width': '896px'}}>
        <div className="my-5 flex bg-white  relative rounded-2xl px-3 md:px-10 py-8 shadow-lg hover:shadow-2xl transition duration-500 inner-wrapper">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="175" height="128" viewBox="0 0 225 178" className="opacity-0 md:opacity-100 absolute top-0 left-0 rounded-tl-lg card-icon-top-left"><g className="b"><path className="c" fill={currentPost && currentPost.color} d="M-119.629 288.973a757.25 757.25 0 0150.612-108.2c6.721-11.834 14.043-23.8 24.987-31.9 33.8-24.994 80.881-2.451 122.921-2.605 42.945-.159 84.52-27.979 101.047-67.616S186.97-10.1 156.86-40.72C120.126-78.067 62.726-84.396 10.326-84.573c-31.173-.1-63.814 1.6-90.732 17.315-48.195 28.143-62.321 90.328-69.158 145.715-4.736 38.377-8.108 78.07 3.044 115.095 9.232 30.656 28.4 60.613 22.57 92.1"></path><path className="d" fill="none" stroke={currentPost && currentPost.color} stroke-width="3" d="M39.915 162.413s106.928 33.328 158.308-73.6"></path></g></svg> */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="215" height="133" viewBox="0 0 265 183" className="opacity-0 md:opacity-100 absolute bottom-0 left-0 rounded-bl-lg card-icon-bottom-left"><g className="b"><path className="c" fill={currentPost && currentPost.color} d="M-105.702 43.053c4.013 24.4 33.442 35.709 58.152 34.8C12.56 75.628 69.836 30.24 127.827 46.215c45.019 12.4 71.944 57.16 94.3 98.156l38.209 70.058c7.164 13.132 14.135 30.11 5.026 41.978-4.416 5.754-11.575 8.549-18.369 11.082l-181.854 67.8c-7.629 2.844-15.9 5.725-23.736 3.509-8.413-2.379-14.106-9.988-19.157-17.125l-68.342-96.57c-15.713-22.2-31.616-44.757-40.8-70.362s-10.964-55.088 1.358-79.339"></path><path className="d" stroke={currentPost && currentPost.color} fill="none" stroke-width="3" d="M45.266 34.477s62.979-30.656 108.983 6.26"></path></g></svg> */}
          <svg onClick={handleInfoClick}  data-tip="Click to know more !" width="20" height="20" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" id="info123" className="absolute right-4 top-4 cursor-pointer"><circle cx="23" cy="23" r="22" stroke="#52575C" stroke-width="2"></circle><path d="M30.472 12.356c0 .888-.318 1.656-.954 2.304a3.13 3.13 0 01-2.322.972c-.888 0-1.656-.324-2.304-.972-.648-.648-.972-1.416-.972-2.304 0-.888.324-1.656.972-2.304.648-.648 1.416-.972 2.304-.972a3.13 3.13 0 012.322.972c.636.648.954 1.416.954 2.304zM27.7 30.932c0 .384-.906 1.284-2.718 2.7-1.812 1.416-3.45 2.124-4.914 2.124-1.008 0-1.74-.258-2.196-.774-.456-.516-.684-1.098-.684-1.746 0-.408.06-.786.18-1.134.12-.348.252-.702.396-1.062l3.42-7.092c.192-.408.33-.738.414-.99.084-.252.126-.474.126-.666 0-.192-.036-.33-.108-.414a.36.36 0 00-.288-.126c-.312 0-.918.474-1.818 1.422s-1.434 1.422-1.602 1.422c-.192 0-.384-.132-.576-.396-.192-.264-.288-.432-.288-.504 0-.24.228-.63.684-1.17.456-.54 1.032-1.11 1.728-1.71.624-.552 1.374-1.068 2.25-1.548.876-.48 1.65-.72 2.322-.72 1.08 0 1.89.306 2.43.918.54.612.81 1.35.81 2.214 0 .36-.036.744-.108 1.152a4.058 4.058 0 01-.468 1.26l-2.736 6.012a12.95 12.95 0 00-.468 1.224c-.096.312-.144.528-.144.648 0 .144.036.234.108.27a.48.48 0 00.216.054c.528 0 1.146-.378 1.854-1.134.708-.756 1.158-1.134 1.35-1.134.168 0 .348.126.54.378.192.252.288.426.288.522z" fill="#52575C"></path></svg>
          <img src={process.env.PUBLIC_URL + "/gift.png"} alt="" className="absolute right-4 bottom-4 h-9 w-9" />
          <div className="hidden md:flex w-2/3 justify-center items-center flex-col">
            <img src={process.env.PUBLIC_URL + postUrl} alt="" className="h-64 rounded-t-lg" />
          </div>
          <div className="flex w-full mx-3 pil-10 pir-10">
              <div className="form w-full">
                <h4 className="text-center text-gray-700 xl:text-2xl xs:text-base mb-10 font-bold tracking-wide font-grotesk" >{currentPost && currentPost.title}</h4>
                <div className="flex items-center">
                  <label className="font-patrick xl:text-lg xs:text-base text-gray-500 tracking-wide">To</label>
                  <input className="pl-2 w-1/2 ml-3 mt-1 mab-3 outline-none text-xl tracking-wide font-medium border-b-2  text-black" name="receiver" type="text" value={postData.receiver} onChange={handleChange}></input>
                </div>
                <div className="h-40 mb-20 mt-8">
                  <textarea className="tracking-wider h-40 msg-box w-full leading-10 resize-none xl:text-xl xs:text-base outline-none text-gray-500 px-2" name="msg" value={postData.msg} onChange={handleChange} style={{'padding': '8px 0 8px 10px', 'line-height': '40px'}}></textarea>
                </div>
                <div className="flex items-center">
                  <label className="font-patrick xl:text-lg xs:text-base text-gray-500 tracking-wide">From</label>
                  <input className="pl-2 w-1/2 ml-3 mab-6 outline-none text-xl font-medium tracking-wide border-b-2 text-black" name="sender" type="text" value={postData.sender} onChange={handleChange}></input>
                </div>
              </div>
          </div>
        </div>
    </div>
  )
}

function BackPost () {
  const {post}= useContext(PostContext);
  const [postData, setPostData] = post;
  const [cardDimension, setCardDimension] = useState({width: '', height: ''});

  const { title } = useParams();
  const currentPost = Object.values(postData.cards).find((p) => {
    return p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z\-]/g, '') === title
  });

  const frontPost = document.querySelector('.front-post .inner-wrapper');
  const handleClick = e => {
    setPostData({
      ...postData,
      flipped: false
    });
  };

  useEffect(() => {
    window.addEventListener("resize", function() {
      const frontPost = document.querySelector('.front-post .inner-wrapper');
      setCardDimension({
        width: frontPost && frontPost.offsetWidth + 'px',
        height: frontPost && frontPost.offsetHeight + 'px'
      })
    });
  }, []);

  return (
    <div className={"transition duration-500 ease-linear mx-auto absolute grid grid-cols-1 col-auto transform  mx-3 md:mx-10 w-full  back-post " + (postData.flipped ? "rotate-y-0 opacity-100" : "opacity-0 rotate-y-180") + (postData.animatePost ? 'anim' : '')} style={{'height' : cardDimension.height || frontPost && frontPost.offsetHeight + 'px', 'width': cardDimension.width || frontPost && frontPost.offsetWidth + 'px'}}>
      <div className="relative rounded-2xl px-3 flex bg-white items-center md:px-10 shadow-lg hover:shadow-2xl transition duration-500">
        <button className="absolute top-4 right-4" onClick={handleClick}><svg width="25" height="25" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="info-close-icon"><circle cx="33" cy="33" r="30.5" stroke="#000" stroke-width="5"></circle><rect x="20" y="23.536" width="5" height="31.799" rx="2.5" transform="rotate(-45 20 23.536)" fill="#000"></rect><rect x="42.486" y="20" width="5" height="31.799" rx="2.5" transform="rotate(45 42.486 20)" fill="#000"></rect></svg></button>
        <ul className="list-inside md:list-outside xl:p-14 md:p-7 pt-7" >
          {
            currentPost && (currentPost.desc.split('!')).map(ele =>
              <li className="text-left md:text-lg xl:text-xl mb-3 tracking-wide">{ele}</li>
            )
          }
        </ul>
      </div>
    </div>
  )
};
