// ============================================================
//  Navbar – sticky top navigation with transparent → solid scroll
// ============================================================
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { clearUser } from '../redux/authSlice';
import {
  FaSearch, FaHeart, FaBell, FaSignOutAlt, FaUser,
} from 'react-icons/fa';
import { MdLocalMovies } from 'react-icons/md';

const Navbar = () => {
  const [scrolled,     setScrolled]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user }   = useSelector(state => state.auth);
  const { items }  = useSelector(state => state.watchlist);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();

  // Become opaque after the user scrolls 60px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#user-menu-container')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm transition-colors duration-200 hover:text-white ${
        location.pathname === to
          ? 'text-white font-semibold'
          : 'text-gray-400'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-netflix-dark/95 backdrop-blur-sm shadow-xl'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-10 py-4">

        {/* ── Logo + Desktop links ── */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <MdLocalMovies className="text-netflix-red text-3xl" />
            <span className="text-netflix-red text-xl font-black tracking-wider hidden sm:block">
              StreamFlix
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLink('/',          'Home')}
            {navLink('/search',    'Search')}
            {navLink('/watchlist', 'My List')}
          </div>
        </div>

        {/* ── Right-side icons ── */}
        <div className="flex items-center gap-4 md:gap-5">

          {/* Search */}
          <Link
            to="/search"
            id="nav-search"
            className="text-gray-300 hover:text-white transition-colors"
            title="Search"
          >
            <FaSearch className="text-base" />
          </Link>

          {/* Notifications (cosmetic) */}
          <button
            className="text-gray-300 hover:text-white transition-colors hidden sm:block"
            title="Notifications"
          >
            <FaBell className="text-base" />
          </button>

          {/* Watchlist with badge */}
          <Link
            to="/watchlist"
            id="nav-watchlist"
            className="relative text-gray-300 hover:text-netflix-red transition-colors"
            title="My Watchlist"
          >
            <FaHeart className="text-base" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-netflix-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length > 9 ? '9+' : items.length}
              </span>
            )}
          </Link>

          {/* User avatar + dropdown */}
          <div id="user-menu-container" className="relative">
            <button
              id="user-menu-btn"
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent hover:ring-netflix-red transition-all">
                {user?.displayName?.[0]?.toUpperCase()
                  || user?.email?.[0]?.toUpperCase()
                  || 'U'}
              </div>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-white text-sm font-semibold truncate">
                    {user?.displayName || 'StreamFlix User'}
                  </p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{user?.email}</p>
                </div>

                <Link
                  to="/watchlist"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                >
                  <FaHeart className="text-netflix-red" />
                  My Watchlist
                  {items.length > 0 && (
                    <span className="ml-auto bg-netflix-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {items.length}
                    </span>
                  )}
                </Link>

                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm border-t border-gray-800"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav links */}
      <div className="flex md:hidden items-center gap-6 px-4 pb-2 text-sm">
        {navLink('/',          'Home')}
        {navLink('/search',    'Search')}
        {navLink('/watchlist', 'My List')}
      </div>
    </nav>
  );
};

export default Navbar;
