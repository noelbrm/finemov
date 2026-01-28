import React, {useEffect, useRef, useState} from "react";
import {fetchFullMovieData} from "./api/fetchLikeMovieData.js";
import {buildDiscoverURL} from "./utils/buildDiscoverURL.js"
import spinner from "./assets/180-ring.svg"
import RecommendCard from "./components/RecommendCard.jsx";
import {FilterMovies} from "./utils/FilterMovies.js";
import SelectedMovieView from "./components/SelectedMovieView.jsx";
import {fetchAll} from "./api/fetchAll.js";
import {topLikeDislike} from "./utils/topLikeDislike.js";

function RecommendationView({like, dislike, onReset}) {

    const [fullInfo, setFullInfo] = useState([])
    const [page, setPage] = useState(1);
    const [recommendations, setRecommendations] = useState([])
    const [recommendationsFull, setFullRecommendations] = useState([])
    const [loading, setLoading] = useState(true);
    const recommendUrl = useRef("")
    const [empty, setEmpty] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null);
    const { topLike, topDislike } = topLikeDislike(like, dislike);

    useEffect(() => {
        async function loadData() {
            const movieData = await Promise.all(
                like.map(async (m) => {
                    const full = await fetchFullMovieData(m.id);
                    return { ...m, ...full };
                }
            ));
            setFullInfo(movieData);
            recommendUrl.current = buildDiscoverURL(movieData, dislike, page);
            console.log(recommendUrl.current)
            const { results } = await fetchAll(recommendUrl.current);
            if (results.length === 0) setEmpty(true)
            setRecommendations((r) => [...r, ...FilterMovies(results, like)]);
            setLoading(false);
        }
        loadData();

    }, [like, dislike, page]);

    useEffect(() => {
        if (!recommendations) return;

        async function loadFullData() {
            const fullData = await Promise.all(
                recommendations.map(m => fetchFullMovieData(m.id))
            );
            setFullRecommendations(fullData);
        }

        loadFullData();
    }, [recommendations]);

    const handleReset = () => {
        onReset()
    }


    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center">
                <p className="text-white p-5">Loading...</p>
                <img src={spinner} alt="Daumen runter" className={``} />
            </div>
        );
    }
        return(
            <div className="">
                <div className="">
                    <h1 id={"Recommendation-text"}>
                        Movie Recommendations
                    </h1>
                    <div className="text-white/60">
                        <p>Liked genres: <span className="text-white font-light">{topLike.join(", ")}</span></p>
                        <p>Disliked genres: <span className="text-white font-light">{topDislike.join(", ")}</span></p>
                    </div>
                </div>
                <button className="my-6 px-10 py-2 rounded-2xl bg-black/80 border border-white/20 text-white text-sm cursor-pointer hover:bg-white/5" onClick={handleReset}>Reset</button>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                        {recommendationsFull.map(movie => (
                                <RecommendCard key={movie.id} recommendMovie={movie} onClick={(m) => setSelectedMovie(m)}/>
                        ))}
                </div>
                <div className="mt-8 p-3">
                    <button className="my-6 px-10 py-2 font-light rounded-2xl bg-black/80 border border-white/20 text-white text-sm  hover:bg-white/5 transition duration-150 cursor-pointer"
                    onClick={() => setPage(page+1)}>{empty? "No more Movies" : "Load More"}</button>
                </div>

                {selectedMovie && (
                    <SelectedMovieView
                        movie={selectedMovie}
                        onClose={() => setSelectedMovie(null)}
                    />
                )}

            </div>
        );


}

export default RecommendationView
