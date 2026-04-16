// ============================================================
//  App.jsx – root component with lazy-loaded routes
// ============================================================
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary  from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// ── Lazy-loaded pages (code-splitting via React.lazy) ────────
const Home      = lazy(() => import('./pages/Home'));
const Login     = lazy(() => import('./pages/Login'));
const Signup    = lazy(() => import('./pages/Signup'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Search    = lazy(() => import('./pages/Search'));
const Player    = lazy(() => import('./pages/Player'));

// Fallback shown by Suspense while a chunk is loading
const PageLoader = () => (
  <div className="min-h-screen bg-netflix-dark flex flex-col items-center justify-center gap-5">
    <div className="w-12 h-12 border-[3px] border-netflix-red border-t-transparent rounded-full animate-spin" />
    <span className="text-netflix-red text-xl font-black tracking-widest">StreamFlix</span>
    <p className="text-gray-700 text-sm">Loading…</p>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected routes (require auth) ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />

        {/* ── Catch-all → redirect home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

export default App;
