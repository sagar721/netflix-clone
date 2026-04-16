// ============================================================
//  TMDB API Service
//  Axios instance pre-configured with the TMDB base URL and
//  API key. All movie-fetching functions live here.
// ============================================================
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

// Image base URLs exported for use in components
export const POSTER_BASE_URL   = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const THUMB_BASE_URL    = 'https://image.tmdb.org/t/p/w300';

/** Shared axios instance – api_key is injected into every request */
const tmdb = axios.create({
  baseURL: BASE_URL,
  params:  { api_key: import.meta.env.VITE_TMDB_API_KEY },
});

// --- Movie list endpoints ------------------------------------

/** Weekly trending movies */
export const getTrending     = ()  => tmdb.get('/trending/movie/week');

/** Top-rated movies (all time) */
export const getTopRated     = ()  => tmdb.get('/movie/top_rated');

/** Action movies (genre 28) */
export const getActionMovies = ()  => tmdb.get('/discover/movie', { params: { with_genres: 28 } });

/** Comedy movies (genre 35) */
export const getComedyMovies = ()  => tmdb.get('/discover/movie', { params: { with_genres: 35 } });

/** Horror movies (genre 27) */
export const getHorrorMovies = ()  => tmdb.get('/discover/movie', { params: { with_genres: 27 } });

/** Romance movies (genre 10749) */
export const getRomanceMovies = () => tmdb.get('/discover/movie', { params: { with_genres: 10749 } });

/** Sci-Fi movies (genre 878) */
export const getSciFiMovies   = () => tmdb.get('/discover/movie', { params: { with_genres: 878 } });

// --- Single movie endpoints ----------------------------------

/**
 * Fetch video clips for a movie (used to find the YouTube trailer key)
 * @param {number} id – TMDB movie ID
 */
export const getMovieTrailer  = (id) => tmdb.get(`/movie/${id}/videos`);

/**
 * Search movies by a text query
 * @param {string} query
 */
export const searchMovies     = (query) => tmdb.get('/search/movie', { params: { query } });

/**
 * Fetch similar / recommended movies for a given movie
 * @param {number} id – TMDB movie ID
 */
export const getSimilarMovies = (id) => tmdb.get(`/movie/${id}/similar`);

/**
 * Fetch full movie details (runtime, genres, tagline, etc.)
 * @param {number} id – TMDB movie ID
 */
export const getMovieDetails  = (id) => tmdb.get(`/movie/${id}`);

export default tmdb;
