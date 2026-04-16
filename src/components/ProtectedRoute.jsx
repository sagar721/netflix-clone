// ============================================================
//  ProtectedRoute – guards routes for authenticated users only
// ============================================================
import { useSelector } from 'react-redux';
import { Navigate }    from 'react-router-dom';

/**
 * Wraps any route that requires the user to be logged in.
 * Shows a spinner while Firebase resolves the saved session.
 * Redirects to /login if not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector(state => state.auth);

  // Show a branded loading screen while Firebase checks auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex flex-col items-center justify-center gap-5">
        {/* Spinner */}
        <div className="w-14 h-14 border-[3px] border-netflix-red border-t-transparent rounded-full animate-spin" />
        {/* Logo text */}
        <span className="text-netflix-red text-2xl font-black tracking-widest">StreamFlix</span>
        <p className="text-gray-600 text-sm">Loading your experience…</p>
      </div>
    );
  }

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
