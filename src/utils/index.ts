export const MUSIC_PLACEHOLDER = '/music-placeholder.svg';

export const formatDuration = (seconds: string | number): string => {
  const s = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
  if (isNaN(s)) return '0:00';
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getBestImage = (images?: { quality: string; url: string }[], size: 'sm' | 'md' | 'lg' = 'md'): string => {
  if (!images || images.length === 0) return '';
  const quality = size === 'lg' ? '500x500' : size === 'md' ? '150x150' : '50x50';
  return images.find((img) => img.quality === quality)?.url || images[images.length - 1]?.url || '';
};

export const getBestAudio = (downloadUrls?: { quality: string; url: string }[]): string => {
  const playableUrls = downloadUrls?.filter(({ url }) => Boolean(url)) || [];
  if (playableUrls.length === 0) return '';
  const preferred = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
  for (const q of preferred) {
    const url = playableUrls.find((d) => d.quality === q)?.url;
    if (url) return url;
  }
  return playableUrls[playableUrls.length - 1]?.url || '';
};

export const getPrimaryArtist = (song: any): string => {
  return song?.artists?.primary?.[0]?.name || 'Unknown Artist';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str: string, len = 30): string => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};
