import React, { useEffect, useMemo, useState } from "react";
import { motion as Motion, useMotionValue, useTransform } from "motion/react";
import Card from "../components/Card.jsx";
import noEye from "../assets/eye-off.svg";
import heart from "../assets/heart.svg";
import dislike from "../assets/x.svg";
import Header from "../components/Header.jsx";
import RecommendationView from "./RecommendationView.jsx";

function SwipeView({ items, setItems, fetchMore }) {
    const [likeMovie, setLikeMovie] = useState([]);
    const [dislikeMovie, setDislikeMovie] = useState([]);
    const [, setUnknownMovie] = useState([]);
    const [activeSwipe, setActiveSwipe] = useState(null);
    const dragX = useMotionValue(0);

    const movieCount = likeMovie.length + dislikeMovie.length;

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
        if (movieCount < 10 && items.length < 3) {
            fetchMore();
        }

        dragX.set(0);
        setActiveSwipe(null);
    }, [dragX, fetchMore, items.length, movieCount]);

    const handleDragXChange = (latest) => {
        const nextSwipe = latest > 10 ? "like" : latest < -10 ? "dislike" : null;

        setActiveSwipe(prev => prev === nextSwipe ? prev : nextSwipe);
        dragX.set(latest);
    };

    const handleVote = (setter) => {
        if (items.length === 0) return;

        const top = items[0];
        setter(prev => [top, ...prev]);
        setItems(prev => prev.slice(1));
    };

    const handleLike = () => handleVote(setLikeMovie);
    const handleDislike = () => handleVote(setDislikeMovie);
    const handleUnknown = () => handleVote(setUnknownMovie);

    const handleReset = () => {
        setLikeMovie([]);
        setDislikeMovie([]);
        setUnknownMovie([]);
        setItems([]);
        fetchMore();
    };

    const visibleItems = useMemo(() => items.slice().reverse(), [items]);

    if (movieCount === 10) {
        return (
            <RecommendationView
                like={likeMovie}
                dislike={dislikeMovie}
                onReset={handleReset}
            />
        );
    }

    return (
        <div className="max-w-md">
            <Header movieCount={movieCount} />
            <div className="grid place-items-center">
                {visibleItems.map(e => {
                    return (
                        <Card
                            key={e.id}
                            movie={e}
                            setLikeMovies={handleLike}
                            setDislikeMovies={handleDislike}
                            isTop={items[0]?.id === e.id}
                            dragxChange={handleDragXChange}
                        />
                    );
                })}
            </div>
            <div className="p-6 flex flex-row justify-center gap-10 items-center">
                <Motion.button
                    onClick={handleDislike}
                    style={{ transform: dislikeScale }}
                    className={`w-18 h-18 border-3 rounded-full flex justify-center items-center bg-gray-400/5 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 transition duration-150 hover:scale-120 ${activeSwipe === "dislike" ? "bg-red-500/10 border-red-500" : ""}`}
                    type="button"
                >
                    <img src={dislike} alt="down vote" className="w-9 h-9 opacity-60 transition duration-150" />
                </Motion.button>
                <Motion.button
                    onClick={handleUnknown}
                    className="group w-16 h-16 border-3 bg-gray-400/5 border-white/40 rounded-full flex justify-center items-center hover:bg-black/20 hover:border-white/60 transition duration-150 hover:scale-110"
                    type="button"
                >
                    <img src={noEye} alt="neutral vote" className="w-7 h-7 opacity-60 transition duration-150" />
                </Motion.button>
                <Motion.button
                    onClick={handleLike}
                    style={{ transform: likeScale }}
                    className={`w-18 h-18 border-3 rounded-full flex justify-center items-center border-green-500/40 bg-gray-400/5 hover:bg-green-500/10 hover:border-green-500 transition duration-150 hover:scale-120 ${activeSwipe === "like" ? "bg-green-500/10 border-green-500" : ""}`}
                    type="button"
                >
                    <img src={heart} alt="up vote" className="w-8 h-8 opacity-60 transition" />
                </Motion.button>
            </div>
        </div>
    );
}

export default SwipeView;
