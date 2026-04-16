// ============================================================
//  Signup Page – create an account via Firebase Auth
// ============================================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FaEye, FaEyeSlash, FaSpinner, FaCheck } from 'react-icons/fa';
import { MdLocalMovies } from 'react-icons/md';

const FIREBASE_ERRORS = {
  'auth/email-already-in-use':   'An account with this email already exists.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/weak-password':          'Password is too weak (min 6 characters).',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/operation-not-allowed':  '⚠️ Email/Password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method → Email/Password → Enable.',
  'auth/too-many-requests':      'Too many attempts. Please try again later.',
  'auth/internal-error':         'Firebase internal error. Double-check your .env file.',
  'auth/configuration-not-found':'Firebase Auth not configured. Check your .env VITE_FIREBASE_* values.',
};

/** Simple password-strength level (1–4) */
const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const Signup = () => {
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const navigate = useNavigate();

  const strength       = passwordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      navigate('/');
    } catch (err) {
      // Log the real Firebase error code so you can debug
      console.error('[Signup] Firebase error code:', err.code, '| message:', err.message);
      setError(
        FIREBASE_ERRORS[err.code]
          || `Sign up failed (${err.code || 'unknown'}). Check the browser console for details.`
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center relative py-8"
      style={{
        backgroundImage:
          'url(https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/images/IN-en-20240115-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      {/* Logo */}
      <div className="absolute top-6 left-6 md:left-10 flex items-center gap-2 z-10">
        <MdLocalMovies className="text-netflix-red text-4xl" />
        <span className="text-netflix-red text-3xl font-black tracking-wide">StreamFlix</span>
      </div>

      {/* Form card */}
      <div className="relative z-10 bg-black/85 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 md:p-12 animate-fade-in">
        <h2 className="text-white text-3xl font-black mb-1">Create Account</h2>
        <p className="text-gray-500 text-sm mb-8">
          Join millions of StreamFlix members today
        </p>

        {error && (
          <div className="bg-netflix-red/15 border border-netflix-red/50 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="signup-name" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password strength bar */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(lvl => (
                    <div
                      key={lvl}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        strength >= lvl ? STRENGTH_COLORS[strength] : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${
                  strength <= 1 ? 'text-red-400' :
                  strength === 2 ? 'text-orange-400' :
                  strength === 3 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {STRENGTH_LABELS[strength]} password
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirm" className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
                className={`w-full bg-gray-900 border rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-colors ${
                  confirmPassword && !passwordsMatch
                    ? 'border-netflix-red focus:border-netflix-red focus:ring-netflix-red'
                    : confirmPassword && passwordsMatch
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-700 focus:border-netflix-red focus:ring-netflix-red'
                }`}
              />
              {passwordsMatch && (
                <FaCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm" />
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-netflix-red text-white py-3.5 rounded-lg font-bold text-base hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <><FaSpinner className="animate-spin" /> Creating Account…</>
              : 'Get Started'
            }
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-8 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-netflix-red transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
