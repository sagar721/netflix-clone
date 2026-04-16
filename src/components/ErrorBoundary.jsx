// ============================================================
//  ErrorBoundary – catches runtime errors in child subtrees
//  Must be a class component (React requirement for error boundaries)
// ============================================================
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-netflix-dark flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🎬</div>
            <h1 className="text-4xl font-black text-netflix-red mb-4">
              Oops! Something broke
            </h1>
            <p className="text-gray-400 mb-2 text-sm font-mono bg-gray-900 rounded p-3">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <p className="text-gray-500 mb-8 mt-4">
              Try refreshing – if it keeps happening, your API keys or Firebase
              config may be missing. Check your <code className="text-red-400">.env</code> file.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-netflix-red text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
