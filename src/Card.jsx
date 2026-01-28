import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, useMotionValueEvent } from "framer-motion";

function Card({movie, setLikeMovies, setDislikeMovies, isTop, dragxChange}) {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0]);
    const scale = useTransform(x, [-200, 0, 200], [0.85, 1, 0.85]);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);

    useMotionValueEvent(x, "change", (latest) => {
        dragxChange(latest)
    });

    const handleDragEnd = () => {
        const offset = x.get()

        if (offset > 30) {
            setLikeMovies()
        } else if (offset < -30) {
            setDislikeMovies()
        } else {
            x.set(0)
        }
    };

    return(
    <motion.div
        className={`relative rounded-lg hover:cursor-grab active:cursor-grabbing border md:w-[350px] border-white/2 overflow-hidden flex flex-col
        ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        style={
        {gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        scale,
        rotate,
    }}
        drag={isTop ? "x" : false}
        dragConstraints={{left: 0, right: 0}}
        onDragEnd={handleDragEnd}>
        <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt="Card"
            className="pointer-events-none"
        />
        <div className={`p-5 flex flex-col justify-end absolute bottom-0 bg-gradient-to-b from-transparent to-black w-full h-1/3`}>
            <div className={"text-white text-xl"}>
                {/* TITLE?*/}
            </div>
            <div>
                <ul className="flex flex-row gap-2 flex-wrap">{movie.genre_ids.map((g) =>
                    <li className="px-2 py-1 text-white border border-white/20 rounded-2xl bg-black/30 text-sm h-fit">
                        {g.name}
                    </li>)}
                </ul>
            </div>
        </div>
    </motion.div>);
}

export default Card