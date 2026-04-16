// ============================================================
//  authSlice – manages Firebase auth state in Redux
// ============================================================
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,   // { uid, email, displayName }
    loading: true,   // true while Firebase checks saved session
    error:   null,
  },
  reducers: {
    /** Called by the onAuthStateChanged listener in main.jsx */
    setUser(state, action) {
      state.user    = action.payload;
      state.loading = false;
      state.error   = null;
    },
    /** Called on logout or when Firebase reports no session */
    clearUser(state) {
      state.user    = null;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setAuthError(state, action) {
      state.error   = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
