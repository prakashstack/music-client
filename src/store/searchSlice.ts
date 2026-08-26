import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  recentSearches: string[];
}

const initialState: SearchState = {
  query: '',
  recentSearches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => { state.query = action.payload; },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter((s) => s !== action.payload),
      ].slice(0, 10);
    },
  },
});

export const { setQuery, addRecentSearch } = searchSlice.actions;
export default searchSlice.reducer;
