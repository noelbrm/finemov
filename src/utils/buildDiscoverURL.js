export function buildDiscoverURL(movies, dislikedMovies, page) {
    let today = new Date().toISOString().slice(0, 10)
    const castIds = [
        ...new Set(
            movies.flatMap(movie => movie.cast.map(c => c.id))
        )
    ].join("|");

    const directorIds = [
        ...new Set(
            movies.map(m => m.director_id).filter(Boolean)
        )
    ].join("|");

    const genreIds = [...new Set(movies.flatMap(m => m.genre_ids.map(g => g.id)))].join("|");

    const likedGenreIds = new Set(
        movies.flatMap(m => m.genre_ids?.map(g => g.id) || [])
    );

    const allDislikedGenreIds = new Set(
        dislikedMovies.flatMap(m => m.genre_ids?.map(g => g.id) || [])
    );

    const pureHateGenreIds = [...allDislikedGenreIds].filter(
        id => !likedGenreIds.has(id)
    );
    console.log(pureHateGenreIds)

    const dislikedGenreCount = {};

    dislikedMovies.forEach(movie => {
        (movie.genre_ids || []).forEach(g => {
            const id = g.id || g;
            if (!likedGenreIds.has(id)) {
                dislikedGenreCount[id] = (dislikedGenreCount[id] || 0) + 1;
            }
        });
    });

    const top3HatedGenres = Object.entries(dislikedGenreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

    const url =
        `https://api.themoviedb.org/3/discover/movie?` +
        `with_cast=${castIds}` +
        `&with_crew=${directorIds}` +
        `&with_genres=${genreIds}` +
        `&without_genres=${top3HatedGenres}` +
        `&primary_release_date.lte=${today}` +
        `&page=${page}` +
        `&sort_by=popularity.desc`;

    return url;
}