import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import MovieDetails from './MovieDetails';
import ImageWithFallback from './ImageWithFallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [sortValue, setSortValue] = useState('relevance');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_KEY = 'd6ec7a3c';
  const API_URL = 'https://www.omdbapi.com/';

  const performSearch = async () => {
    if (!query) {
      alert('Please enter a movie name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        setResults(sortResults(data.Search, sortValue));
      } else {
        setError(data.Error || "No movies found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Something went wrong. Please check your API key and internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (movies, sortType) => {
    const sorted = [...movies];
    switch (sortType) {
      case 'az':
        return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      case 'za':
        return sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      case 'newest':
        return sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      case 'oldest':
        return sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      default:
        return sorted;
    }
  };
  
  const handleSortChange = (e) => {
      const newSortValue = e.target.value;
      setSortValue(newSortValue);
      if (results.length > 0) {
          setResults(sortResults(results, newSortValue));
      }
  }

  return (
    <div>
        <div className="navigation-area">
            <div>
                <h1 className="navbar-title">Movie Search</h1>
                <div className="sort-container">
                    <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                    <select id="sort-select" value={sortValue} onChange={handleSortChange}>
                        <option value="relevance">Relevance</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>
            <div className="navbar-search-sort">
                <div className="search-container">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search for a movie..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                    />
                    <button id="search-btn" onClick={performSearch}>Search</button>
                </div>
            </div>
        </div>
      <div className="container">
        <main id="result-container">
        {loading && <p style={{ color: 'white', textAlign: 'center' }}>Searching...</p>}
        {error && <div className="placeholder-message"><p>{error}</p></div>}
        {!loading && !error && results.length === 0 && <div className="placeholder-message"><p>No movies searched</p></div>}
        {results.map(movie => {
            return (
                <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="movie-card">
                    <ImageWithFallback src={movie.Poster} alt={movie.Title} className="movie-poster" />
                    <div className="movie-info">
                        <h3 className="movie-title">{movie.Title}</h3>
                        <p className="movie-year">{movie.Year}</p>
                    </div>
                </Link>
            )
        })}
        </main>
      </div>
    </div>
  );
}

export default App;
