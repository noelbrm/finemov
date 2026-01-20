import './App.css'
import React, {useEffect, useState, useRef} from "react";
import SwipeView from "./SwipeView.jsx";
import {fetchAll} from "./api/fetchAll.js";


function App() {
    const urlGenre = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
    const [items, setItems] = useState([]);
    const [genres, setGenres] = useState([]);
    const page = useRef(1);

    const fetchItems = async () => {
        let moviedata = await fetchAll(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page.current}`)
        try {
            console.log(moviedata)
            const moviesEnriched = moviedata.results.map(movie => ({
                ...movie,
                genre_ids: movie.genre_ids.map(id => {
                    const g = genres.find(x => x.id === id);
                    return { id, name: g?.name || "Unknown" };
                })
            }));
            page.current = page.current + 1
            setItems(prev => [...prev, ...moviesEnriched]);

        } catch (err) {
            console.error(err);

        }
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchAll(urlGenre);
                setGenres(data?.genres ?? []);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    useEffect(() => {
        if (genres.length === 0) return;
        fetchItems();
    }, [genres]);

    if (items.length > 0) {
        return(
            <div className="flex justify-center items-center">
                <SwipeView
                    items={items}
                    setItems={setItems}
                    fetchMore={fetchItems}
                    genres={genres}
                />
            </div>
        );
    }


}

export default App
