// ============================================================
//  MovieCard – individual movie tile with hover overlay
// ============================================================
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { POSTER_BASE_URL } from '../services/tmdb';
import { addToWatchlist, removeFromWatchlist } from '../redux/watchlistSlice';
import {
  addToFirestoreWatchlist,
  removeFromFirestoreWatchlist,
} from '../services/firestore';
import VideoPlayer from './VideoPlayer';

/**
 * @param {{ movie: object }} props
 */
const MovieCard = ({ movie }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const dispatch  = useDispatch();
  const { user }  = useSelector(state => state.auth);
  const items     = useSelector(state => state.watchlist.items);
  const inList    = items.some(m => m.id === movie.id);

  // Fallback poster for movies without an image
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : `https://placehold.co/300x450/1a1a2e/e50914?text=${encodeURIComponent(movie.title || 'Movie')}`;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const year   = movie.release_date ? movie.release_date.slice(0, 4) : '';

  /** Toggle watchlist (updates Redux + Firestore) */
  const handleWatchlist = async (e) => {
    e.stopPropagation();
    if (!user) return;

    if (inList) {
      dispatch(removeFromWatchlist(movie.id));
      try { await removeFromFirestoreWatchlist(user.uid, movie.id); }
      catch (err) { console.error('[MovieCard] remove from Firestore:', err); }
    } else {
      dispatch(addToWatchlist(movie));
      try { await addToFirestoreWatchlist(user.uid, movie); }
      catch (err) { console.error('[MovieCard] add to Firestore:', err); }
    }
  };

  return (
    <>
      <div
        className="relative flex-shrink-0 w-36 md:w-44 cursor-pointer group"
        onClick={() => setShowPlayer(true)}
        role="button"
        tabIndex={0}
        aria-label={`Play ${movie.title || movie.name}`}
        onKeyDown={(e) => e.key === 'Enter' && setShowPlayer(true)}
      >
        {/* ── Poster ── */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={posterUrl}
            alt={movie.title || movie.name || 'Movie poster'}
            className="w-full h-52 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onLoad={(e) => e.target.classList.add('loaded')}
          />

          {/* ── Hover overlay ── */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex flex-col justify-between p-3">

            {/* Top: watchlist button */}
            <div className="flex justify-end">
              <button
                onClick={handleWatchlist}
                className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-netflix-red transition-all duration-200"
                title={inList ? 'Remove from My List' : 'Add to My List'}
                aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {inList
                  ? <FaHeart    className="text-netflix-red text-xs" />
                  : <FaRegHeart className="text-white text-xs" />
                }
              </button>
            </div>

            {/* Center: play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-13 h-13 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                <FaPlay className="text-white text-base ml-0.5" />
              </div>
            </div>

            {/* Bottom: rating + year */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-[10px]">{year}</span>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-[10px]" />
                <span className="text-yellow-400 text-[10px] font-bold">{rating}</span>
              </div>
            </div>
          </div>

          {/* Watchlist indicator dot (always visible when in list) */}
          {inList && (
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-netflix-red shadow-md shadow-red-500/50 group-hover:opacity-0 transition-opacity" />
          )}
        </div>

        {/* ── Below-poster text ── */}
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-medium line-clamp-1">
            {movie.title || movie.name}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-gray-600 text-[10px]">{year}</span>
            <div className="flex items-center gap-0.5">
              <FaStar className="text-yellow-500 text-[9px]" />
              <span className="text-gray-400 text-[10px]">{rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {showPlayer && (
        <VideoPlayer movie={movie} onClose={() => setShowPlayer(false)} />
      )}
    </>
  );
};

export default MovieCard;
