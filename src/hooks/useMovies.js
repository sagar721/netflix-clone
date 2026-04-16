// ============================================================
//  useMovies – custom hook for fetching TMDB data
// ============================================================
import { useState, useEffect } from 'react';

/**
 * Generic data-fetching hook for TMDB API calls.
 *
 * @param {Function} fetchFn – one of the functions from services/tmdb.js
 * @returns {{ data: Array, loading: boolean, error: string|null }}
 *
 * Usage:
 *   const { data, loading, error } = useMovies(getTrending);
 */
const useMovies = (fetchFn) => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let isMounted = true; // prevent state updates after unmount

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFn();
        if (isMounted) {
          setData(response.data.results || []);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err?.response?.data?.status_message
            || err.message
            || 'Failed to fetch movies';
          setError(msg);
          console.error('[useMovies]', msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    // Cleanup: prevent memory leaks / state updates after unmount
    return () => { isMounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //  ↑ Empty deps – fetchFn reference is stable (module-level functions)

  return { data, loading, error };
};

export default useMovies;
