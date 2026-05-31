import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchFullMovieData } from "../api/fetchLikeMovieData.js";
import { buildDiscoverURL } from "../utils/buildDiscoverURL.js";
import spinner from "../assets/180-ring.svg";
import RecommendCard from "../components/RecommendCard.jsx";
import { FilterMovies } from "../utils/FilterMovies.js";
import SelectedMovieView from "./SelectedMovieView.jsx";
import { fetchAll } from "../api/fetchAll.js";
import { topLikeDislike } from "../utils/topLikeDislike.js";

function RecommendationView({ like, dislike, onReset }) {
    const [page, setPage] = useState(1);
    const [recommendationsFull, setFullRecommendations] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const detailsCache = useRef(new Map());
    const recommendationIds = useRef(new Set());
    const { topLike, topDislike } = useMemo(
        () => topLikeDislike(like, dislike),
        [like, dislike]
    );

    useEffect(() => {
        let ignore = false;

        const getFullMovie = async (movie) => {
            if (detailsCache.current.has(movie.id)) {
                return detailsCache.current.get(movie.id);
            }

            const full = await fetchFullMovieData(movie.id);
            const fullMovie = { ...movie, ...full };
            detailsCache.current.set(movie.id, fullMovie);
            return fullMovie;
        };

        async function loadData() {
            setIsLoading(true);
            setError("");

            try {
                const likedMovieData = await Promise.all(like.map(getFullMovie));
                const recommendUrl = buildDiscoverURL(likedMovieData, dislike, page);
                const data = await fetchAll(recommendUrl);
                const results = Array.isArray(data?.results) ? data.results : [];
                const filtered = FilterMovies(results, like).filter(
                    movie => !recommendationIds.current.has(movie.id)
                );
                const fullData = await Promise.all(filtered.map(getFullMovie));

                if (ignore) return;

                filtered.forEach(movie => recommendationIds.current.add(movie.id));
                setFullRecommendations(prev => [...prev, ...fullData]);

                if (results.length === 0) {
                    setEmpty(true);
                }
            } catch (err) {
                if (!ignore) {
                    console.error(err);
                    setError(err.message || "Could not load recommendations.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            ignore = true;
        };
    }, [like, dislike, page]);

    const handleReset = () => {
        onReset();
    };

    if (isLoading && recommendationsFull.length < 1) {
        return (
            <div className="flex flex-col justify-center items-center">
                <p className="text-white p-5">Loading...</p>
                <img src={spinner} alt="loading spinner" />
            </div>
        );
    }

    if (error && recommendationsFull.length < 1) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 text-white">
                <p>{error}</p>
                <button className="px-10 py-2 rounded-2xl bg-black/80 border border-white/20 text-sm cursor-pointer hover:bg-white/5" onClick={handleReset} type="button">
                    Reset
                </button>
            </div>
        );
    }

    return (
        <>
            <div>
                <h1 className="Recommendation-text">
                    Movie Recommendations
                </h1>
                <div className="text-white/60">
                    <p>Liked genres: <span className="text-white font-light">{topLike.join(", ") || "None"}</span></p>
                    <p>Disliked genres: <span className="text-white font-light">{topDislike.join(", ") || "None"}</span></p>
                </div>
            </div>
            <button className="my-6 px-10 py-2 rounded-2xl bg-black/80 border border-white/20 text-white text-sm cursor-pointer hover:bg-white/5" onClick={handleReset} type="button">
                Reset
            </button>

            {recommendationsFull.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 place-items-center">
                    {recommendationsFull.map(movie => (
                        <RecommendCard key={movie.id} recommendMovie={movie} onClick={(m) => setSelectedMovie(m)} />
                    ))}
                </div>
            ) : (
                <p className="text-white/70">No recommendations found.</p>
            )}

            <div className="mt-8 p-3">
                <button
                    className="my-6 px-10 py-2 font-light rounded-2xl bg-black/80 border border-white/20 text-white text-sm hover:bg-white/5 transition duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || empty}
                    onClick={() => setPage(prev => prev + 1)}
                    type="button"
                >
                    {empty ? "No more movies" : isLoading ? "Loading..." : "Load More"}
                </button>
            </div>

            {selectedMovie && (
                <SelectedMovieView
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </>
    );
}

export default RecommendationView;
