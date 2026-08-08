import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
  query: string;   
}

interface MoviesResponse {
    results: Movie[]; 
}

export const fetchMovies = async (params: FetchMoviesParams): Promise<MoviesResponse> => { 
    const config = {
        params: params,
      headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    };
     
     const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    config
  );
 
  return response.data;

}