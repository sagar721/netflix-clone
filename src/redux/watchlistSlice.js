// ============================================================
//  watchlistSlice – manages the user's movie watchlist
// ============================================================
import { createSlice } from '@reduxjs/toolkit';

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items:   [], // Array of movie objects
    loading: false,
  },
  reducers: {
    /** Add a movie (no duplicates) */
    addToWatchlist(state, action) {
      const exists = state.items.some(m => m.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    /** Remove a movie by its numeric ID */
    removeFromWatchlist(state, action) {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    /** Bulk-replace (used when syncing from Firestore) */
    setWatchlist(state, action) {
      state.items = action.payload;
    },
    setWatchlistLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  setWatchlist,
  setWatchlistLoading,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
