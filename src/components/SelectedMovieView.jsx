
function SelectedMovieView({movie, onClose}) {

    return(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-black/80 text-white rounded-xl shadow-xl max-w-[500px] w-full p-6 relative overflow-y-auto max-h-[90vh]">
                <h1 id={"movie-title"} className="text-4xl font-bold mb-4">{movie.title}</h1>
                <div className="flex flex-row justify-center gap-3 mb-4 text-white/60 text-sm font-light">
                    <p>{movie.year}</p>
                    <span>•</span>
                    <p>Director: {movie.director_name}</p>
                    <span>•</span>
                    <span>Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {movie.genres.map((g) => (
                        <span
                            key={g.id}
                            className="px-2 py-1 text-white border border-white/20 rounded-2xl bg-white/10 h-fit text-xs">
                            {g.name}
                        </span>
                    ))}
                </div>
                <p>Overview</p>
                <p className="text-sm mb-4 text-white/60 leading-relaxed">{movie.overview}</p>
                {movie.cast && movie.cast.length > 0 && (
                    <div className="mb-6">
                        <h2 className="font-semibold mb-2">Main Cast</h2>
                        <ul className="text-sm text-white/80 space-y-1">
                            {movie.cast.slice(0, 5).map((actor) => (
                                <li key={actor.id}>
                                    {actor.name}{" "}
                                    <span className="text-white/50">
                                        as {actor.character}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#f3ce13] hover:bg-[#C2A30A] text-black rounded-2xl cursor-pointer border border-white/20 font-semibold">
                        <a target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}`}>Open on IMDb</a>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black/80 hover:bg-white/5 hotext-white rounded-2xl cursor-pointer border border-white/20">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

}

export default SelectedMovieView