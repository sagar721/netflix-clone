// ============================================================
//  Firestore Watchlist Service
//  CRUD operations for a user's watchlist stored in Firestore.
//
//  Data model:
//    users/{userId}/watchlist/{movieId}  → movie object
// ============================================================
import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';

/**
 * Add a movie to the user's Firestore watchlist.
 * Uses the movie's numeric TMDB id as the document ID.
 */
export const addToFirestoreWatchlist = async (userId, movie) => {
  try {
    const ref = doc(db, 'users', userId, 'watchlist', String(movie.id));
    await setDoc(ref, {
      id:           movie.id,
      title:        movie.title   || movie.name || 'Untitled',
      poster_path:  movie.poster_path   || null,
      backdrop_path:movie.backdrop_path || null,
      vote_average: movie.vote_average  || 0,
      overview:     movie.overview      || '',
      release_date: movie.release_date  || '',
      genre_ids:    movie.genre_ids     || [],
      addedAt:      new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Firestore] addToWatchlist error:', err);
    throw err;
  }
};

/**
 * Remove a movie from the user's Firestore watchlist.
 * @param {string} userId
 * @param {number} movieId – numeric TMDB movie ID
 */
export const removeFromFirestoreWatchlist = async (userId, movieId) => {
  try {
    const ref = doc(db, 'users', userId, 'watchlist', String(movieId));
    await deleteDoc(ref);
  } catch (err) {
    console.error('[Firestore] removeFromWatchlist error:', err);
    throw err;
  }
};

/**
 * Fetch the entire watchlist for a user from Firestore.
 * Returns an empty array on error so the UI doesn't crash.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getFirestoreWatchlist = async (userId) => {
  try {
    const colRef  = collection(db, 'users', userId, 'watchlist');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => d.data());
  } catch (err) {
    console.error('[Firestore] getWatchlist error:', err);
    return [];
  }
};
