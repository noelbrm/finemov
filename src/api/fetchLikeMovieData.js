import {fetchAll} from "./fetchAll.js";

export async function fetchFullMovieData(movieId) {

    const [details, credits] = await Promise.all([
        fetchAll(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`),
        fetchAll(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`)
    ]);

    const director = credits.crew.find(c => c.job === "Director");

    const cast = credits.cast
        .slice(0, 5)
        .map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character
        }));

    const year = details.release_date.split("-")[0]

    return {
        release_date: details.release_date,
        runtime: details.runtime,
        director_id: director?.id || null,
        director_name: director?.name || "Unknown",
        cast: cast,
        vote_average: details.vote_average,
        poster_path: details.poster_path,
        title: details.title,
        year: year,
        overview: details.overview,
        genres: details.genres,
        imdb_id: details.imdb_id,
        tagline: details.tagline
    };
}
