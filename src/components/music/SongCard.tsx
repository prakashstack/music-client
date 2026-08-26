import { Play, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Song } from '../../types';
import { getBestImage, getPrimaryArtist, formatDuration, MUSIC_PLACEHOLDER } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { toggleFavorite } from '../../store/favoritesSlice';
import { playSong } from '../../store/playerSlice';
import { musicService } from '../../services/api';

interface SongCardProps {
  song: Song;
  queue?: Song[];
  variant?: 'grid' | 'list';
  index?: number;
}

export const SongCard = ({ song, queue, variant = 'grid', index }: SongCardProps) => {
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.favorites.songIds.includes(song.id));
  const currentSong = useAppSelector((s) => s.player.currentSong);
  const isPlaying = useAppSelector((s) => s.player.isPlaying);
  const isCurrentSong = currentSong?.id === song.id;

  const artwork = getBestImage(song.image, 'lg');
  const artist = getPrimaryArtist(song);
  const albumName = song.album?.name || '';

  const handlePlay = async () => {
    // List and search responses may omit the protected full-track URL. Resolve
    // the selected song before playback instead of using a short preview URL.
    try {
      const fullSong = await musicService.getSong(song.id) as Song;
      const playableSong = fullSong?.downloadUrl?.length ? fullSong : song;
      const nextQueue = (queue || [song]).map((queuedSong) =>
        queuedSong.id === song.id ? playableSong : queuedSong
      );
      dispatch(playSong({ song: playableSong, queue: nextQueue }));
    } catch (error) {
      console.warn('Could not resolve the full-length audio stream:', error);
      dispatch(playSong({ song, queue: queue || [song] }));
    }
  };
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(song));
  };

  if (variant === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className={`group flex items-center gap-4 p-3 rounded-2xl song-card-hover cursor-pointer ${
          isCurrentSong ? 'bg-[#FFF8C7] border border-[#FFDE21]' : 'hover:bg-white border border-transparent hover:border-[#E4E4E7]'
        }`}
        onClick={handlePlay}
      >
        {index !== undefined && (
          <span className="w-6 text-center text-sm font-bold text-[#71717A] group-hover:text-[#1A1A1A]">{index + 1}</span>
        )}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#F4F4F5] border border-[#E4E4E7]">
          <img src={artwork || MUSIC_PLACEHOLDER} alt={song.name} className="w-full h-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.src = MUSIC_PLACEHOLDER; }} />
          {isCurrentSong && isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="flex gap-0.5">
                <span className="wave-bar" /><span className="wave-bar" /><span className="wave-bar" />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold line-clamp-1 ${
            isCurrentSong ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'
          }`}>{song.name}</p>
          <p className="text-xs font-semibold text-[#71717A] line-clamp-1">{artist}</p>
        </div>
        {albumName && <p className="hidden md:block text-xs font-medium text-[#71717A] line-clamp-1 w-36">{albumName}</p>}
        <button
          onClick={handleFavorite}
          className="p-2 rounded-full hover:bg-[#F4F4F5] transition-opacity cursor-pointer"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFav ? '#E11D48' : 'none'} className={isFav ? 'text-[#E11D48]' : 'text-[#71717A] group-hover:text-[#1A1A1A]'} />
        </button>
        <span className="text-xs font-semibold text-[#71717A] w-12 text-right">{formatDuration(song.duration)}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer p-2.5 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-[#E4E4E7] hover:shadow-lg hover:shadow-black/5"
      onClick={handlePlay}
    >
      <div className="relative rounded-xl overflow-hidden aspect-square mb-3 bg-[#F4F4F5] border border-[#E4E4E7] shadow-sm">
        <img src={artwork || MUSIC_PLACEHOLDER} alt={song.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={(event) => { event.currentTarget.src = MUSIC_PLACEHOLDER; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3" />
        <button
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-[#FFDE21] hover:bg-[#F2C900] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg shadow-black/20 cursor-pointer"
          aria-label={`Play ${song.name}`}
        >
          <Play size={20} fill="#1A1A1A" className="text-[#1A1A1A] ml-0.5" />
        </button>
        {isCurrentSong && isPlaying && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <span className="wave-bar" /><span className="wave-bar" /><span className="wave-bar" />
          </div>
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
          aria-label={isFav ? 'Unlike' : 'Like'}
        >
          <Heart size={16} fill={isFav ? '#E11D48' : 'none'} className={isFav ? 'text-[#E11D48]' : 'text-white'} />
        </button>
        {isCurrentSong && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFDE21]" />
        )}
      </div>
      <p className={`text-sm font-bold line-clamp-1 mb-1 ${
        isCurrentSong ? 'text-[#1A1A1A]' : 'text-[#1A1A1A] transition-colors'
      }`}>{song.name}</p>
      <p className="text-xs font-semibold text-[#71717A] line-clamp-1">{artist}</p>
    </motion.div>
  );
};
