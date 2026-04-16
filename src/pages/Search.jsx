// ============================================================
//  Search Page – real-time TMDB search with debounce
// ============================================================
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import {
  setQuery,
  setResults,
  setSearchLoading,
  setSearchError,
  clearSearch,
} from '../redux/searchSlice';
import { searchMovies } from '../services/tmdb';
import useDebounce from '../hooks/useDebounce';
import { FaSearch, FaTimes, FaFire } from 'react-icons/fa';

/** Popular searches shown in the empty state */
const POPULAR = ['Avengers', 'Batman', 'Inception', 'Interstellar', 'John Wick', 'Dune'];

const Search = () => {
  const dispatch   = useDispatch();
  const { query, results, loading, error } = useSelector(state => state.search);

  // Debounce the query so we don't fire an API call on every keystroke
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      dispatch(setResults([]));
      return;
    }

    const doSearch = async () => {
      dispatch(setSearchLoading(true));
      try {
        const res = await searchMovies(debouncedQuery.trim());
        dispatch(setResults(res.data.results || []));
      } catch (err) {
        dispatch(setSearchError('Search failed. Please check your TMDB API key.'));
      }
    };

    doSearch();
  }, [debouncedQuery, dispatch]);

  const handleClear = () => dispatch(clearSearch());

  return (
    <div className="min-h-screen bg-netflix-dark">
      <Navbar />

      <div className="pt-28 px-4 md:px-10 lg:px-16 pb-20">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-black mb-6 flex items-center gap-3">
            <FaSearch className="text-netflix-red" />
            Search
          </h1>

          {/* Search input */}
          <div className="relative max-w-2xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={e => dispatch(setQuery(e.target.value))}
              placeholder="Search for movies, shows, actors…"
              autoFocus
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-11 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all text-base shadow-lg"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Live typing indicator */}
          {query && query !== debouncedQuery && (
            <p className="text-gray-600 text-xs mt-2 ml-1">Searching…</p>
          )}
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div>
            <p className="text-gray-500 text-sm mb-4">
              Searching for <span className="text-white">"{debouncedQuery}"</span>…
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="bg-red-950/30 border border-red-900 rounded-xl p-6 text-center max-w-md mx-auto">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* ── No results ── */}
        {!loading && !error && debouncedQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-7xl mb-6">🎬</div>
            <h2 className="text-white text-xl font-bold mb-2">No results found</h2>
            <p className="text-gray-500 max-w-xs">
              We couldn't find anything matching <span className="text-white">"{debouncedQuery}"</span>.
              Try a different title or keyword.
            </p>
          </div>
        )}

        {/* ── Empty / start state ── */}
        {!loading && !query && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-7xl mb-6">🔍</div>
            <h2 className="text-white text-xl font-bold mb-2">
              What would you like to watch?
            </h2>
            <p className="text-gray-500 max-w-sm mb-10">
              Search for movies, TV shows, actors, and more.
            </p>

            {/* Popular searches */}
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-3 flex items-center gap-2 justify-center">
                <FaFire className="text-netflix-red" /> Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR.map(term => (
                  <button
                    key={term}
                    onClick={() => dispatch(setQuery(term))}
                    className="bg-gray-900 border border-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-800 hover:border-netflix-red hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Search results grid ── */}
        {!loading && !error && results.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-6">
              <span className="text-white font-semibold">{results.length}</span> results for{' '}
              <span className="text-netflix-red font-semibold">"{debouncedQuery}"</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
