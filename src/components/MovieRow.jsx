// ============================================================
//  MovieRow – horizontally scrollable row of MovieCards
// ============================================================
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import { SkeletonRow } from './SkeletonLoader';

/**
 * @param {{
 *   title:   string,
 *   movies:  Array,
 *   loading: boolean,
 *   error:   string|null
 * }} props
 */
const MovieRow = ({ title, movies, loading, error }) => {
  const rowRef = useRef(null);

  /** Scroll the row left or right by one "page" */
  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left:     dir === 'left' ? -700 : 700,
      behavior: 'smooth',
    });
  };

  // Loading state → shimmer skeleton
  if (loading) return <SkeletonRow count={7} />;

  // Error state
  if (error) {
    return (
      <div className="px-4 md:px-8 my-6">
        <h2 className="text-white text-lg font-bold mb-3">{title}</h2>
        <div className="bg-red-950/40 border border-red-900 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm">
            ⚠️ Failed to load. Please check your TMDB API key in{' '}
            <code className="text-red-300">.env</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!movies?.length) return null;

  return (
    <div className="relative group/row px-4 md:px-8 my-8">
      {/* Row title */}
      <h2 className="text-white text-lg md:text-xl font-bold mb-4 flex items-center gap-2 select-none">
        {title}
        <span className="text-netflix-red text-xs font-normal opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer hover:underline">
          See all ›
        </span>
      </h2>

      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="
          absolute left-0 md:left-2 z-20
          top-1/2 -translate-y-3
          w-10 h-10 rounded-full
          bg-black/80 border border-gray-700
          text-white flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          hover:bg-netflix-red hover:border-netflix-red
          transition-all duration-200 shadow-lg
        "
      >
        <FaChevronLeft className="text-sm" />
      </button>

      {/* Scrollable movie strip */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="
          absolute right-0 md:right-2 z-20
          top-1/2 -translate-y-3
          w-10 h-10 rounded-full
          bg-black/80 border border-gray-700
          text-white flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          hover:bg-netflix-red hover:border-netflix-red
          transition-all duration-200 shadow-lg
        "
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default MovieRow;
