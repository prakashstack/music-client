import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Song, PlayerState } from '../types';

const initialState: PlayerState = {
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,
  progress: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 'off',
  isQueueOpen: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<{ song: Song; queue?: Song[] }>) => {
      const { song, queue } = action.payload;
      const newQueue = queue || [song];
      const idx = newQueue.findIndex((s) => s.id === song.id);
      state.currentSong = song;
      state.queue = newQueue;
      state.currentIndex = idx >= 0 ? idx : 0;
      state.isPlaying = true;
      state.progress = 0;
    },
    togglePlay: (state) => { state.isPlaying = !state.isPlaying; },
    setIsPlaying: (state, action: PayloadAction<boolean>) => { state.isPlaying = action.payload; },
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      let next = state.currentIndex + 1;
      if (state.repeatMode === 'all' && next >= state.queue.length) next = 0;
      if (next < state.queue.length) {
        state.currentIndex = next;
        state.currentSong = state.queue[next];
        state.isPlaying = true;
        state.progress = 0;
      } else {
        state.isPlaying = false;
      }
    },
    prevSong: (state) => {
      if (state.progress > 3) { state.progress = 0; return; }
      const prev = state.currentIndex - 1;
      if (prev >= 0) {
        state.currentIndex = prev;
        state.currentSong = state.queue[prev];
        state.isPlaying = true;
        state.progress = 0;
      }
    },
    setProgress: (state, action: PayloadAction<number>) => { state.progress = action.payload; },
    setDuration: (state, action: PayloadAction<number>) => { state.duration = action.payload; },
    setVolume: (state, action: PayloadAction<number>) => { state.volume = action.payload; state.isMuted = action.payload === 0; },
    toggleMute: (state) => { state.isMuted = !state.isMuted; },
    toggleShuffle: (state) => { state.isShuffled = !state.isShuffled; },
    cycleRepeat: (state) => {
      const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
      const idx = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(idx + 1) % modes.length];
    },
    addToQueue: (state, action: PayloadAction<Song>) => { state.queue.push(action.payload); },
    toggleQueue: (state) => { state.isQueueOpen = !state.isQueueOpen; },
    playFromQueue: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      if (idx >= 0 && idx < state.queue.length) {
        state.currentIndex = idx;
        state.currentSong = state.queue[idx];
        state.isPlaying = true;
        state.progress = 0;
      }
    },
  },
});

export const {
  playSong, togglePlay, setIsPlaying, nextSong, prevSong,
  setProgress, setDuration, setVolume, toggleMute,
  toggleShuffle, cycleRepeat, addToQueue, toggleQueue, playFromQueue,
} = playerSlice.actions;
export default playerSlice.reducer;
