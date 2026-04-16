// ============================================================
//  Redux Store – combines all slices
// ============================================================
import { configureStore } from '@reduxjs/toolkit';
import authReducer      from '../redux/authSlice';
import watchlistReducer from '../redux/watchlistSlice';
import searchReducer    from '../redux/searchSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    watchlist: watchlistReducer,
    search:    searchReducer,
  },
  // Firebase User objects aren't fully serialisable; ignore those actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
});
