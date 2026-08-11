import {useEffect, useState } from 'react';
import { fetchMovies } from "../../services/movieService";
import {type Movie } from "../../types/movie";
import toast ,{ Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./App.module.css"

type ModuleWithDefault<T> = {default:T };
const ReactPaginate = (ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>).default;

function App() {

  const [query, setQuery] = useState<string>("");
  const [currentPage, setcurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
 
  const { data: movies, isLoading, isError , isSuccess} = useQuery({
    queryKey: ['movies', query, currentPage ],
    queryFn: () => fetchMovies(query, currentPage ),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
    retry: 2,
    staleTime:5000,
});

  console.log(movies);
 
  const handleSearch = (data: string) => { 
    if (data.length === 0) {
      toast("Please enter your search query.");
    } else { 
      setQuery(data);
      setcurrentPage(1);
    }
  }
  
  const handleSelect = (m_movie:Movie) => { 
            const movie = movies?.results.find((movie) => movie.id === m_movie.id);
            setSelectedMovie(movie || null);
  }

  useEffect(() => {
    if (isSuccess && movies?.results?.length === 0) {
      toast("Жодного фільму не знайдено");
    }
  }, [isSuccess, movies]);
 
  return (
    <>
      <SearchBar onSubmit={handleSearch} /> 
      <Toaster
      toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            background:'#d67719cb',
          },
      }}/>
      {query && isLoading && <Loader />}
      {isSuccess && movies && movies.results && movies.results.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies.results} />}
      {isSuccess && movies.total_pages > 1 && <ReactPaginate
        pageCount={movies.total_pages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setcurrentPage(selected + 1)}
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
