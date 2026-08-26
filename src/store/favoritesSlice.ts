import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesService } from '../services/api';
import type { Song } from '../types';
import toast from 'react-hot-toast';

interface FavoritesState {
  items: Song[];
  songIds: string[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  items: [],
  songIds: [],
  isLoading: false,
};

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  return await favoritesService.getAll();
});

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (song: Song, { getState }) => {
    const state = (getState() as any).favorites;
    const isFav = state.songIds.includes(song.id);
    if (isFav) {
      await favoritesService.remove(song.id);
      toast.success('Removed from favorites');
      return { type: 'remove', song };
    } else {
      await favoritesService.add(song.id, song);
      toast.success('Added to favorites');
      return { type: 'add', song };
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.songIds = (action.payload || []).map((s: any) => s.id);
        state.isLoading = false;
      })
      .addCase(fetchFavorites.rejected, (state) => { state.isLoading = false; })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { type, song } = action.payload;
        if (type === 'add') {
          state.items.unshift(song);
          state.songIds.push(song.id);
        } else {
          state.items = state.items.filter((s) => s.id !== song.id);
          state.songIds = state.songIds.filter((id) => id !== song.id);
        }
      });
  },
});

export default favoritesSlice.reducer;
