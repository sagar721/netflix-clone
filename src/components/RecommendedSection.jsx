// ============================================================
//  RecommendedSection – "Recommended for You" movie row
//  Uses TMDB's similar-movies endpoint seeded from a trending film
// ============================================================
import useMovies from '../hooks/useMovies';
import { getSimilarMovies } from '../services/tmdb';
import MovieRow from './MovieRow';

/**
 * @param {{ movieId: number }} props – TMDB ID of the seed movie
 */
const RecommendedSection = ({ movieId }) => {
  // fetchFn is defined inline; since movieId is stable at mount, the
  // empty-dep useEffect in useMovies captures it correctly.
  const { data, loading, error } = useMovies(() => getSimilarMovies(movieId));

  // Don't render the row if there's nothing to show
  if (!loading && !data?.length) return null;

  return (
    <MovieRow
      title="🎯 Recommended For You"
      movies={data}
      loading={loading}
      error={error}
    />
  );
};

export default RecommendedSection;
