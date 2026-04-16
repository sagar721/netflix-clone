// ============================================================
//  Login Page – Netflix-style sign-in form with Firebase Auth
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { MdLocalMovies } from 'react-icons/md';

// Map Firebase error codes → user-friendly messages
const FIREBASE_ERRORS = {
  'auth/user-not-found':     'No account found with this email.',
  'auth/wrong-password':     'Incorrect password. Please try again.',
  'auth/invalid-email':      'Please enter a valid email address.',
  'auth/too-many-requests':  'Too many failed attempts. Please try later.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

const Login = () => {
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          'url(https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/images/IN-en-20240115-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Logo */}
      <div className="absolute top-6 left-6 md:left-10 flex items-center gap-2 z-10">
        <MdLocalMovies className="text-netflix-red text-4xl" />
        <span className="text-netflix-red text-3xl font-black tracking-wide">StreamFlix</span>
      </div>

      {/* Form card */}
      <div className="relative z-10 bg-black/85 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 md:p-12 animate-fade-in">
        <h2 className="text-white text-3xl font-black mb-1">Sign In</h2>
        <p className="text-gray-500 text-sm mb-8">Welcome back to StreamFlix</p>

        {/* Error banner */}
        {error && (
          <div className="bg-netflix-red/15 border border-netflix-red/50 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-netflix-red text-white py-3.5 rounded-lg font-bold text-base hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <><FaSpinner className="animate-spin" /> Signing In…</>
              : 'Sign In'
            }
          </button>
        </form>

        {/* Sign-up link */}
        <p className="text-gray-600 text-sm mt-8 text-center">
          New to StreamFlix?{' '}
          <Link
            to="/signup"
            className="text-white font-semibold hover:text-netflix-red transition-colors"
          >
            Create an account
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-3">
          <p className="text-gray-500 text-xs text-center">
            🔑 Make sure your <code className="text-gray-400">.env</code> file has valid
            Firebase and TMDB API keys before logging in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
