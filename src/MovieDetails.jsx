import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetails.css';
import ImageWithFallback from './ImageWithFallback';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = 'd6ec7a3c';
    const API_URL = 'https://www.omdbapi.com/';

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch movie details
                const movieUrl = `${API_URL}?apikey=${API_KEY}&i=${id}&plot=full`;
                const response = await fetch(movieUrl);
                const data = await response.json();

                if (data.Response === "True") {
                    setMovie(data);
                    // Fetch recommendations based on the movie title
                    const recommendationsUrl = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(data.Title.split(' ')[0])}&type=movie`;
                    const recommendationsResponse = await fetch(recommendationsUrl);
                    const recommendationsData = await recommendationsResponse.json();
                    if (recommendationsData.Response === "True") {
                        // Filter out the current movie from recommendations and take the first 5
                        setRecommendations(recommendationsData.Search.filter(m => m.imdbID !== id).slice(0, 5));
                    }
                } else {
                    setError(data.Error || "Movie details not found.");
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <p style={{ color: 'white', textAlign: 'center' }}>Loading details...</p>;
    }

    if (error) {
        return <div className="placeholder-message"><p>{error}</p></div>;
    }

    if (!movie) {
        return null;
    }

    return (
        <div className="movie-details-container">
            <Link to="/" className="back-link">Back to Search</Link>
            <div className="movie-details-card">
                <ImageWithFallback src={movie.Poster} alt={movie.Title} className="movie-details-poster" />
                <div className="movie-details-info">
                    <h1 className="movie-details-title">{movie.Title}</h1>
                    <p><strong>Year:</strong> {movie.Year}</p>
                    <p><strong>Rated:</strong> {movie.Rated}</p>
                    <p><strong>Released:</strong> {movie.Released}</p>
                    <p><strong>Runtime:</strong> {movie.Runtime}</p>
                    <p><strong>Genre:</strong> {movie.Genre}</p>
                    <p><strong>Director:</strong> {movie.Director}</p>
                    <p><strong>Writer:</strong> {movie.Writer}</p>
                    <p><strong>Actors:</strong> {movie.Actors}</p>
                    <p><strong>Plot:</strong> {movie.Plot}</p>
                    <p><strong>Language:</strong> {movie.Language}</p>
                    <p><strong>Country:</strong> {movie.Country}</p>
                    <p><strong>Awards:</strong> {movie.Awards}</p>
                    <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                    <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer" className="imdb-link">View on IMDb</a>
                </div>
            </div>

            <div className="recommendations-container">
                <h2>Recommended Movies</h2>
                <div className="recommendations-grid">
                    {recommendations.map(rec => {
                        return (
                            <Link to={`/movie/${rec.imdbID}`} key={rec.imdbID} className="movie-card">
                                <ImageWithFallback src={rec.Poster} alt={rec.Title} className="movie-poster" />
                                <div className="movie-info">
                                    <h3 className="movie-title">{rec.Title}</h3>
                                    <p className="movie-year">{rec.Year}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
