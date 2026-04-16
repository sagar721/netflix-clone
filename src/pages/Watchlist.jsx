// ============================================================
//  Watchlist Page – shows the user's saved movies
//  Syncs with Firestore on mount to restore the list after refresh
// ============================================================
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonLoader';
import { setWatchlist, setWatchlistLoading } from '../redux/watchlistSlice';
import { getFirestoreWatchlist } from '../services/firestore';
import { FaHeart, FaFilm, FaSearch } from 'react-icons/fa';

const Watchlist = () => {
  const dispatch         = useDispatch();
  const { user }         = useSelector(state => state.auth);
  const { items, loading } = useSelector(state => state.watchlist);

  // Restore watchlist from Firestore on first load
  useEffect(() => {
    if (!user) return;

    const sync = async () => {
      dispatch(setWatchlistLoading(true));
      try {
        const firestoreItems = await getFirestoreWatchlist(user.uid);
        // Only replace Redux state if Firestore has data
        // (avoids wiping a watchlist that was added this session)
        if (firestoreItems.length > 0) {
          dispatch(setWatchlist(firestoreItems));
        }
      } catch (err) {
        console.error('[Watchlist] Firestore sync failed:', err);
      } finally {
        dispatch(setWatchlistLoading(false));
      }
    };

    sync();
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-netflix-dark">
      <Navbar />

      <div className="pt-28 px-4 md:px-10 lg:px-16 pb-20">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-2">
          <FaHeart className="text-netflix-red text-2xl" />
          <h1 className="text-white text-3xl font-black">My List</h1>
          {items.length > 0 && (
            <span className="bg-netflix-red text-white text-xs font-bold px-2.5 py-1 rounded-full ml-1">
              {items.length}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-10">
          Movies and shows you've saved – synced across all your devices.
        </p>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
              <FaFilm className="text-gray-700 text-4xl" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Your list is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
              Start adding movies by clicking the{' '}
              <FaHeart className="inline text-netflix-red mx-1" />
              icon on any movie card.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/"
                className="bg-netflix-red text-white px-7 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Browse Movies
              </Link>
              <Link
                to="/search"
                className="bg-gray-800 border border-gray-700 text-white px-7 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FaSearch className="text-sm" />
                Search
              </Link>
            </div>
          </div>
        )}

        {/* ── Watchlist Grid ── */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {items.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
