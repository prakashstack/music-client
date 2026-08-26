import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  getMe: () => api.get('/auth/me').then((r) => r.data.data),  // Will use /auth/me via proxy
  logout: () => api.post('/auth/logout'),
};

// Fix auth calls to use /auth prefix
const authAxios = axios.create({ baseURL: '/auth', withCredentials: true });
export const authService = {
  getMe: () => authAxios.get('/me').then((r) => r.data.data),
  logout: () => authAxios.post('/logout').then((r) => r.data),
};

// Music
export const musicService = {
  getTrending: () => api.get('/music/trending').then((r) => r.data.data),
  getNewReleases: () => api.get('/music/new-releases').then((r) => r.data.data),
  search: (q: string, type = 'all', page = 1) =>
    api.get('/music/search', { params: { q, type, page } }).then((r) => r.data.data),
  getSong: (id: string) => api.get(`/music/song/${id}`).then((r) => r.data.data),
  getAlbum: (id: string) => api.get(`/music/album/${id}`).then((r) => r.data.data),
  getArtist: (id: string) => api.get(`/music/artist/${id}`).then((r) => r.data.data),
  getGenres: () => api.get('/music/genres').then((r) => r.data.data),
  getGenreSongs: (genre: string) => api.get(`/music/genre/${genre}`).then((r) => r.data.data),
  getLyrics: (id: string) => api.get(`/music/lyrics/${id}`).then((r) => r.data.data),
};

// Favorites
export const favoritesService = {
  getAll: () => api.get('/favorites').then((r) => r.data.data),
  add: (songId: string, songData: any) =>
    api.post(`/favorites/${songId}`, { songData }).then((r) => r.data),
  remove: (songId: string) => api.delete(`/favorites/${songId}`).then((r) => r.data),
  check: (songId: string) => api.get(`/favorites/check/${songId}`).then((r) => r.data.data),
};

// History
export const historyService = {
  getPlays: (page = 1) => api.get('/history/plays', { params: { page } }).then((r) => r.data.data),
  recordPlay: (songId: string, songData: any, completionPercentage: number) =>
    api.post('/history/plays', { songId, songData, completionPercentage }).then((r) => r.data),
  getSearches: () => api.get('/history/searches').then((r) => r.data.data),
  recordSearch: (query: string) =>
    api.post('/history/searches', { query }).then((r) => r.data),
};

// Recommendations
export const recommendationsService = {
  getSections: () => api.get('/recommendations/sections').then((r) => r.data.data),
};

// User
export const userService = {
  getProfile: () => api.get('/user/profile').then((r) => r.data.data),
  getPreferences: () => api.get('/user/preferences').then((r) => r.data.data),
};
