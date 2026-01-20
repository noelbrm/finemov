import React from "react";
import star from "../assets/star-solid.svg"

function RecommendCard({recommendMovie, onClick}) {

    return(
        <div key={recommendMovie.id} className="rounded-2xl overflow-hidden border border-white/10 relative h-fit max-w-[300px] font-light hover:scale-103 hover:border-white/30 transition duration-150 cursor-pointer"
             onClick={() => onClick(recommendMovie)}>
            <div className="relative">
                <img src={`https://image.tmdb.org/t/p/w300${recommendMovie.poster_path}`}/>
                <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-b from-transparent to-black"></div>
            </div>
            <div className="bg-black text-white px-3 pb-3 pt-1 flex flex-col items-center">
                <div className="">
                    <p className="">{recommendMovie.title}</p>
                </div>
                <div className="flex flex-row gap-2 text-xs text-white/60">
                    <p>{recommendMovie.director_name}</p>
                    <p>·</p>
                    <p>({recommendMovie.year})</p>
                </div>
                <div className="flex flex-col w-full my-2 px-4 gap-2 items-center">
                    <div className="flex flex-row items-center gap-2 text-sm">
                        <img className="w-4 h-4" src={star} />
                        <span>{recommendMovie.vote_average.toFixed(2)}</span>
                    </div>
                    <div className="">
                        <ul className="flex flex-row gap-2 flex-wrap justify-center">{recommendMovie.genres.map((g) =>
                            <li className="px-2 py-1 text-white border border-white/20 rounded-2xl bg-white/10 h-fit text-xs">
                                {g.name}
                            </li>)}
                        </ul>
                    </div>
                </div>
                <div className="">
                    <p className="text-xs line-clamp-3">{recommendMovie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default RecommendCard