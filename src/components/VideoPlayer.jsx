// ============================================================
//  VideoPlayer – YouTube trailer modal
// ============================================================
import { useState, useEffect } from 'react';
import { getMovieTrailer } from '../services/tmdb';
import { FaTimes, FaSpinner, FaYoutube } from 'react-icons/fa';

/**
 * @param {{ movie: object, onClose: Function }} props
 */
const VideoPlayer = ({ movie, onClose }) => {
  const [videoKey, setVideoKey] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Fetch the YouTube trailer key from TMDB
  useEffect(() => {
    let mounted = true;

    const fetchTrailer = async () => {
      try {
        setLoading(true);
        const res    = await getMovieTrailer(movie.id);
        const videos = res.data.results || [];

        // Priority: Official Trailer → any Trailer → any YouTube video
        const pick =
          videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
          videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
          videos.find(v => v.site === 'YouTube');

        if (mounted) {
          if (pick) setVideoKey(pick.key);
          else setError('No trailer available for this movie.');
        }
      } catch (err) {
        if (mounted) setError('Could not load trailer. Check your TMDB API key.');
        console.error('[VideoPlayer]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTrailer();
    return () => { mounted = false; };
  }, [movie.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          aria-label="Close trailer"
        >
          <FaTimes className="text-lg" />
          <span>Close (Esc)</span>
        </button>

        {/* Movie title */}
        <h2 className="text-white font-bold text-lg mb-3 line-clamp-1">
          {movie.title || movie.name}
        </h2>

        {/* 16:9 video container */}
        <div className="relative w-full aspect-video bg-gray-950 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <FaSpinner className="text-netflix-red text-4xl animate-spin" />
              <p className="text-gray-500 text-sm">Fetching trailer…</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
              <FaYoutube className="text-gray-700 text-7xl" />
              <p className="text-gray-400 text-center">{error}</p>
              <button
                onClick={onClose}
                className="bg-netflix-red text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 mt-2"
              >
                Close
              </button>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0&color=red`}
              title={`${movie.title || movie.name} – Trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
