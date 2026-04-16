// ============================================================
//  HeroBanner – full-bleed featured movie at the top of Home
// ============================================================
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlay, FaHeart, FaRegHeart, FaStar, FaInfoCircle } from 'react-icons/fa';
import { BACKDROP_BASE_URL } from '../services/tmdb';
import { addToWatchlist, removeFromWatchlist } from '../redux/watchlistSlice';
import {
  addToFirestoreWatchlist,
  removeFromFirestoreWatchlist,
} from '../services/firestore';
import VideoPlayer from './VideoPlayer';
import { SkeletonBanner } from './SkeletonLoader';

/**
 * @param {{ movies: Array, loading: boolean }} props
 */
const HeroBanner = ({ movies, loading }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const items    = useSelector(state => state.watchlist.items);

  /* Pick a random movie from the top-5 trending (stable per mount) */
  const movie = useMemo(() => {
    if (!movies?.length) return null;
    return movies[Math.floor(Math.random() * Math.min(5, movies.length))];
  }, [movies]);

  if (loading) return <SkeletonBanner />;
  if (!movie) return null;

  const inList      = items.some(m => m.id === movie.id);
  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : null;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year   = movie.release_date ? movie.release_date.slice(0, 4) : '';

  const handleWatchlist = async () => {
    if (!user) return;
    if (inList) {
      dispatch(removeFromWatchlist(movie.id));
      try { await removeFromFirestoreWatchlist(user.uid, movie.id); } catch (_) {}
    } else {
      dispatch(addToWatchlist(movie));
      try { await addToFirestoreWatchlist(user.uid, movie); } catch (_) {}
    }
  };

  return (
    <>
      <div className="relative h-[88vh] w-full overflow-hidden">

        {/* ── Backdrop ── */}
        {backdropUrl
          ? <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
              onLoad={(e) => e.target.classList.add('loaded')}
            />
          : <div className="w-full h-full bg-gray-900" />
        }

        {/* ── Gradient overlays ── */}
        {/* Left & bottom darken to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
        {/* Subtle top vignette for navbar contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* ── Content ── */}
        <div className="absolute bottom-28 left-6 md:left-12 lg:left-16 text-white max-w-lg md:max-w-2xl animate-slide-up">

          {/* Genre badge */}
          <div className="inline-flex items-center gap-1.5 bg-netflix-red/20 border border-netflix-red/40 text-netflix-red text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <FaStar className="text-[9px]" />
            Featured
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-4 drop-shadow-2xl">
            {movie.title || movie.name}
          </h1>

          {/* Meta: rating + year + HD */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            {rating && (
              <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                <FaStar className="text-xs" /> {rating}
              </div>
            )}
            {year && <span className="text-gray-300">{year}</span>}
            <span className="border border-gray-500 text-gray-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              HD
            </span>
          </div>

          {/* Overview */}
          <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-8 leading-relaxed max-w-xl">
            {movie.overview || 'No description available.'}
          </p>

          {/* ── CTAs ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play trailer */}
            <button
              id="hero-play-btn"
              onClick={() => setShowPlayer(true)}
              className="flex items-center gap-2.5 bg-white text-black px-7 py-3.5 rounded-lg font-bold text-sm md:text-base shadow-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
            >
              <FaPlay className="text-sm" />
              Play Trailer
            </button>

            {/* Watchlist toggle */}
            <button
              id="hero-watchlist-btn"
              onClick={handleWatchlist}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-bold text-sm md:text-base transition-all duration-200 active:scale-95 ${
                inList
                  ? 'bg-netflix-red/20 border border-netflix-red text-netflix-red hover:bg-netflix-red/30'
                  : 'bg-white/10 backdrop-blur-sm border border-gray-500 text-white hover:bg-white/20'
              }`}
            >
              {inList ? <FaHeart className="text-netflix-red" /> : <FaRegHeart />}
              {inList ? 'In My List' : 'My List'}
            </button>
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

export default HeroBanner;
