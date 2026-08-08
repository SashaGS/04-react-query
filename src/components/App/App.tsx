import {useState } from 'react';
import { fetchMovies } from "../../services/movieService";
import {type Movie } from "../../types/movie";
import toast from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./App.module.css"

type ModuleWithDefault<T> = {default:T };
const ReactPaginate = (ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>).default;

function App() {

  const [query, setQuery] = useState<string>("");
  const [currentPage, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
 
  const { data: movies, isLoading, isError } = useQuery({
    queryKey: ['movies', query, currentPage ],
    queryFn: () => fetchMovies({ query, page:currentPage }),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime:5000,
});

  console.log(movies);
 
  const handleSearch = (data: string) => { 
    if (data.length === 0) {
      toast("Please enter your search query.");
    } else { 
      setQuery(data);
    }
  }
  
  const handleSelect = (m_movie:Movie) => { 
            const movie = movies?.results.find((movie) => movie.id === m_movie.id);
            setSelectedMovie(movie || null);
  }
 
  return (
    <>
      <SearchBar onSubmit={handleSearch} /> 
      {isLoading && <Loader />}
      {movies && movies.results && movies.results.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies.results} />}
      {movies && <ReactPaginate
        pageCount={movies.total_pages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />}
      {isError && <ErrorMessage />}
      {selectedMovie  && <MovieModal onClose={() => setSelectedMovie(null)} movie={selectedMovie} />}
    </>
  )
}

export default App
