// ============================================================
//  main.jsx – app entry point
//  Sets up Redux Provider, BrowserRouter, and Firebase auth listener
// ============================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './app/store';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './redux/authSlice';

import './index.css';

/**
 * Listen to Firebase auth state changes and sync with Redux.
 * This runs before initial render so ProtectedRoute has the
 * correct loading/user state on first paint.
 */
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // Store only serialisable fields (not the raw Firebase user object)
    store.dispatch(
      setUser({
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: firebaseUser.displayName,
      })
    );
  } else {
    store.dispatch(clearUser());
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
