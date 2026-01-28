export function topLikeDislike(like, dislike) {

    const countGenres = (movies) => {
        const counts = {};

        movies.forEach(movie => {
            movie?.genre_ids?.forEach(g => {
                const name = g.name;
                if (!name) return;
                counts[name] = (counts[name] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([name]) => name);
    };

    const topLike = countGenres(like);
    const topDislike = countGenres(dislike).filter(name => !topLike.includes(name))

    return {
        topLike,
        topDislike
    };
}