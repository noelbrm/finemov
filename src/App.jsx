import "./App.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SwipeView from "./views/SwipeView.jsx";
import { fetchAll } from "./api/fetchAll.js";

const urlGenre = "https://api.themoviedb.org/3/genre/movie/list?language=en";

function App() {
    const [items, setItems] = useState([]);
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState("");
    const page = useRef(1);
    const didFetchInitial = useRef(false);
    const isFetching = useRef(false);

    const fetchItems = useCallback(async () => {
        if (isFetching.current || genres.length === 0) return;

        isFetching.current = true;
        setError("");

        try {
            const moviedata = await fetchAll(
                `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page.current}`
            );
            const moviesEnriched = moviedata.results.map(movie => ({
                ...movie,
                genre_ids: movie.genre_ids.map(id => {
                    const genre = genres.find(x => x.id === id);
                    return { id, name: genre?.name || "Unknown" };
                }),
            }));

            page.current += 1;
            setItems(prev => [...prev, ...moviesEnriched]);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not load movies.");
        } finally {
            isFetching.current = false;
        }
    }, [genres]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchAll(urlGenre);
                setGenres(data?.genres ?? []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Could not load genres.");
            }
        })();
    }, []);

    useEffect(() => {
        if (genres.length === 0) return;
        if (didFetchInitial.current) return;

        didFetchInitial.current = true;
        fetchItems();
    }, [fetchItems, genres]);

    return (
        <div className="flex flex-col justify-center items-center text-center">
            {items.length > 0 ? (
                <SwipeView
                    items={items}
                    setItems={setItems}
                    fetchMore={fetchItems}
                />
            ) : (
                <div className="text-white">{error || "Loading..."}</div>
            )}
        </div>
    );
}

export default App;
