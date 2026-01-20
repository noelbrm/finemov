import React, { useState, useEffect, useRef } from "react";
import {motion, useMotionValue, useTransform } from "motion/react"
import Card from "./Card.jsx";
import noEye from "./assets/eye-off.svg";
import heart from "./assets/heart.svg";
import dislike from "./assets/x.svg";
import Header from "./Header.jsx";
import RecommendationView from "./RecommendationView.jsx";


function SwipeView({items, setItems, fetchMore}) {
    const [likeMovie, setLikeMovie] = useState([])
    const [dislikeMovie, setDislikeMovie] = useState([])
    const [unknownMovie, setUnkownMovie] = useState([])
    const dragX = useMotionValue(0)
    const count = useRef(0);

    useEffect(() => {
        count.current = count.current + 1;
    });


    const dislikeScale = useTransform(
        dragX,
        [-70, 0],
        ["scale(1.2)", "scale(1)"]
    );

    const likeScale = useTransform(
        dragX,
        [0, 70],
        ["scale(1)", "scale(1.2)"]
    );



    useEffect(() => {
        if(items.length < 3) {
            fetchMore();
        }
        dragX.set(0)

    }, [items, fetchMore]);

    const handleLike = () => {
        if (items.length === 0) return;
        const top = items[0];
        setLikeMovie((p) => [top, ...p]);
        setItems((p) => p.slice(1));
    };

    const handleDislike = () => {
        if (items.length === 0) return;
        const top = items[0];
        setDislikeMovie((p) => [top, ...p]);
        setItems((p) => p.slice(1));
    };

    const handleUnknown = () => {
        if (items.length === 0) return;
        const top = items[0];
        setUnkownMovie((p) => [top, ...p]);
        setItems((p) => p.slice(1));
    };

    const handleReset = () => {
        setLikeMovie([])
        setDislikeMovie([])
        setUnkownMovie([])
        setItems([])
        fetchMore()
    }

    if(likeMovie.length + dislikeMovie.length === 10) {
        return (<RecommendationView like={likeMovie} dislike={dislikeMovie} onReset={handleReset}/>)
    }

    return(
        <div className="max-w-md">
            <Header like={likeMovie} dislike={dislikeMovie}/>
            <div className="grid place-items-center">
                {items.slice().reverse().map(e => {
                    return <Card
                        key={e.id}
                        movie={e}
                        setLikeMovies={handleLike}
                        setDislikeMovies={handleDislike}
                        setUnknownMovies={handleUnknown}
                        isTop={items[0]?.id === e.id}
                        dragxChange={(v) => dragX.set(v)}
                        />
                })}
            </div>
            <div className="p-6 flex flex-row justify-center gap-10 items-center">
                <motion.button
                    onClick={handleDislike}
                    style={{transform: dislikeScale}}
                    className={`w-18 h-18 border-3 rounded-full flex justify-center items-center bg-gray-400/5 border-red-500/50
                            hover:bg-red-500/10 hover:border-red-500 transition duration-150 hover:scale-120`}>
                    <img src={dislike} alt="Daumen runter" className={`w-9 h-9 opacity-60 transition duration-150`} />
                </motion.button>
                <motion.button
                    onClick={handleUnknown}
                    className="group w-16 h-16 border-3 bg-gray-400/5 border-white/40 rounded-full flex justify-center items-center
            hover:bg-black/20 hover:border-white/60 transition duration-150 hover:scale-110">
                    <img src={noEye} alt="Daumen runter" className="w-7 h-7 opacity-60 transition duration-150" />
                </motion.button>
                <motion.button
                    onClick={handleLike}
                    style={{transform: likeScale}}
                    className={`w-18 h-18 border-3 rounded-full flex justify-center items-center border-green-500/40 bg-gray-400/5
                            hover:bg-green-500/10 hover:border-green-500 transition duration-150 hover:scale-120`}>
                    <img src={heart} alt="Daumen runter" className={`w-8 h-8 opacity-60 transition`} />
                </motion.button>
            </div>
        </div>
    );
}

export default SwipeView