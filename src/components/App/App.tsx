import { useEffect, useState } from 'react';
import { fetchMovies } from "../../services/movieService";
import {type Movie } from "../../types/movie";
import toast from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';



function App() {
  const [query, setQuery]   = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (data: string) => { 
    if (data.length === 0) {
      toast("Please enter your search query.");
    } else { 
      setQuery(data);
    }
  }

  useEffect(() => {  
    const loadMoves = async () => {
      setLoading(true);
      setError(false);
      setMovies([]);
      try {
        if (!query.trim()) return;
        const resp = await fetchMovies({ query });
        console.log(resp.results);
        if (resp.results.length === 0 && movies !== null) {
          toast("No movies found for your request.");
          setMovies([]);
        } else {
          setMovies(resp.results);
        }        
      } catch (error) {
        setError(true);
        setMovies([]);
        console.error("Помилка завантаження фільмів:", error);
      } finally {
        setLoading(false)
      }
    };
    loadMoves();   
  }, [query]); 

  const handleSelect = (m_movie:Movie) => { 
            const movie = movies?.find((movie) => movie.id === m_movie.id);
            setSelectedMovie(movie || null);
  }
 
  return (
    <>
      <SearchBar onSubmit={handleSearch} /> 
      {loading && <Loader />}
      {movies && <MovieGrid onSelect={handleSelect} movies={movies} />}
      {error && <ErrorMessage />}
      {selectedMovie  && <MovieModal onClose={() => setSelectedMovie(null)} movie={selectedMovie} />}
    </>
  )
}

export default App
