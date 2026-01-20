import React from "react";
import heart from './assets/heart-green.svg'
import dontlike from './assets/x-red.svg'
import notseen from './assets/eye-off.svg'

function Header({like, dislike}) {
    let movieCount = (like.length + dislike.length) * 10

    return(
        <header className="text-white">
            <div className="">
                <div className="relative">
                    <h1 id={`Welcome-text`} className="">Finemov<span className=""></span></h1>
                </div>
                <div className="mb-2 flex flex-row justify-center items-center gap-1 font-light text-gray-300 text-sm">
                    <img src={heart} alt="" className="w-5 h-5 opacity-60" />
                    <p className="mr-2">Like</p>
                    <img src={dontlike} alt="" className="w-6 h-6 opacity-60" />
                    <p className="mr-2">Dislike</p>
                    <img src={notseen} alt="" className="w-5 h-5 opacity-60" />
                    <p className="">Not seen</p>
                </div>
            </div>
            <p className="font-light">{`${like.length + dislike.length}/10 Movies`}</p>
            <div className="w-full h-2 bg-[#171717] border border-black/10 rounded-lg mb-5 mt-3 overflow-hidden">
                <div className={`bg-gradient-to-r from-purple-400 to-pink-400 h-full transition-all 200`}
                style={{ width: `${Math.min(movieCount, 100)}%` }}>
                </div>
            </div>
        </header>
    );
}
export default Header