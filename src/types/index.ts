export interface Artist {
  id: string;
  name: string;
  url?: string;
  image?: ImageQuality[];
  role?: string;
}

export interface ImageQuality {
  quality: string;
  url: string;
}

export interface DownloadUrl {
  quality: string;
  url: string;
}

export interface Song {
  id: string;
  name: string;
  duration: string | number;
  year?: string;
  language?: string;
  label?: string;
  explicitContent?: boolean;
  playCount?: number;
  album?: {
    id?: string;
    name?: string;
    url?: string;
  };
  artists?: {
    primary?: Artist[];
    featured?: Artist[];
    all?: Artist[];
  };
  image?: ImageQuality[];
  downloadUrl?: DownloadUrl[];
  url?: string;
  lyricsId?: string;
}

export interface Album {
  id: string;
  name: string;
  year?: string;
  language?: string;
  artists?: { primary?: Artist[] };
  image?: ImageQuality[];
  songs?: Song[];
  url?: string;
}

export interface Genre {
  id: string;
  name: string;
  query: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'songs' | 'artists' | 'genres';
  items: any[];
}

export interface SearchResults {
  songs?: Song[];
  albums?: Album[];
  artists?: Artist[];
  playlists?: any[];
}

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isQueueOpen: boolean;
}
