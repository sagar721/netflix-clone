// ============================================================
//  searchSlice – manages search query and results
// ============================================================
import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query:   '',
    results: [],
    loading: false,
    error:   null,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    setResults(state, action) {
      state.results = action.payload;
      state.loading = false;
      state.error   = null;
    },
    setSearchLoading(state, action) {
      state.loading = action.payload;
    },
    setSearchError(state, action) {
      state.error   = action.payload;
      state.loading = false;
    },
    /** Reset the entire search state */
    clearSearch(state) {
      state.query   = '';
      state.results = [];
      state.loading = false;
      state.error   = null;
    },
  },
});

export const {
  setQuery,
  setResults,
  setSearchLoading,
  setSearchError,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
