import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, Heart, ListMusic
} from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { toggleFavorite } from '../../store/favoritesSlice';
import { toggleQueue } from '../../store/playerSlice';
import { getBestImage, getPrimaryArtist, formatDuration, MUSIC_PLACEHOLDER } from '../../utils';

export const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const player = usePlayer();
  const isFav = useAppSelector((s) =>
    player.currentSong ? s.favorites.songIds.includes(player.currentSong.id) : false
  );

  if (!player.currentSong) return null;

  const song = player.currentSong;
  const artwork = getBestImage(song.image, 'sm');
  const artist = getPrimaryArtist(song);
  const progressPct = player.duration > 0 ? (player.progress / player.duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="mobile-safe-player fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] text-white backdrop-blur-xl border-t border-[#1A1A1A] shadow-2xl shadow-black"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top progress bar indicator */}
      <div className="h-1 bg-[#1A1A2F] relative cursor-pointer" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        player.seek(pct * player.duration);
      }}>
        <div
          className="h-full bg-[#FFDE21] transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-4 px-6 py-3">
        {/* Song Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#2E2E4A] shadow-md">
            <img src={artwork || MUSIC_PLACEHOLDER} alt={song.name} className="w-full h-full object-cover" onError={(event) => { event.currentTarget.src = MUSIC_PLACEHOLDER; }} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white line-clamp-1">{song.name}</p>
            <p className="text-xs font-semibold text-[#CBD5E1] line-clamp-1">{artist}</p>
          </div>
          <button
            onClick={() => dispatch(toggleFavorite(song))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
            aria-label={isFav ? 'Unlike' : 'Like'}
          >
            <Heart size={18} fill={isFav ? '#EC4899' : 'none'} className={isFav ? 'text-[#EC4899]' : 'text-[#CBD5E1]'} />
          </button>
        </div>

        {/* Center Controls (Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-1.5 flex-1">
          <div className="flex items-center gap-5">
            <button
              onClick={player.toggleShuffle}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                player.isShuffled ? 'text-[#A78BFA] bg-[#8B5CF6]/20' : 'text-[#94A3B8] hover:text-white'
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            <button onClick={player.prevSong} className="p-2 text-white hover:text-[#A78BFA] transition-colors cursor-pointer" aria-label="Previous">
              <SkipBack size={22} fill="currentColor" />
            </button>
            <button
              onClick={player.togglePlay}
              className="w-11 h-11 rounded-full bg-[#FFDE21] hover:bg-[#F2C900] flex items-center justify-center transition-all shadow-lg shadow-black/20 cursor-pointer hover:scale-105"
              aria-label={player.isPlaying ? 'Pause' : 'Play'}
            >
              {player.isPlaying ? <Pause size={20} fill="#1A1A1A" className="text-[#1A1A1A]" /> : <Play size={20} fill="#1A1A1A" className="text-[#1A1A1A] ml-0.5" />}
            </button>
            <button onClick={player.nextSong} className="p-2 text-white hover:text-[#A78BFA] transition-colors cursor-pointer" aria-label="Next">
              <SkipForward size={22} fill="currentColor" />
            </button>
            <button
              onClick={player.cycleRepeat}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                player.repeatMode !== 'off' ? 'text-[#A78BFA] bg-[#8B5CF6]/20' : 'text-[#94A3B8] hover:text-white'
              }`}
              aria-label={`Repeat mode: ${player.repeatMode}`}
            >
              {player.repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-xs font-semibold text-[#CBD5E1] w-10 text-right">{formatDuration(player.progress)}</span>
            <input
              type="range"
              className="progress-bar flex-1"
              min={0}
              max={player.duration || 100}
              value={player.progress}
              onChange={(e) => player.seek(parseFloat(e.target.value))}
              aria-label="Seek"
            />
            <span className="text-xs font-semibold text-[#CBD5E1] w-10">{formatDuration(player.duration)}</span>
          </div>
        </div>

        {/* Volume & Queue (Desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          <button onClick={player.toggleMute} className="p-2 text-[#CBD5E1] hover:text-white transition-colors cursor-pointer" aria-label={player.isMuted ? 'Unmute' : 'Mute'}>
            {player.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            className="volume-bar w-24"
            min={0}
            max={1}
            step={0.01}
            value={player.isMuted ? 0 : player.volume}
            onChange={(e) => player.setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
          />
          <button onClick={() => dispatch(toggleQueue())} className="p-2 text-[#CBD5E1] hover:text-white transition-colors cursor-pointer" aria-label="Queue">
            <ListMusic size={20} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={player.prevSong} className="p-2 text-white" aria-label="Previous"><SkipBack size={22} fill="currentColor" /></button>
          <button
            onClick={player.togglePlay}
            className="w-11 h-11 rounded-full bg-[#FFDE21] flex items-center justify-center shadow-lg"
            aria-label={player.isPlaying ? 'Pause' : 'Play'}
          >
            {player.isPlaying ? <Pause size={20} fill="#1A1A1A" className="text-[#1A1A1A]" /> : <Play size={20} fill="#1A1A1A" className="text-[#1A1A1A] ml-0.5" />}
          </button>
          <button onClick={player.nextSong} className="p-2 text-white" aria-label="Next"><SkipForward size={22} fill="currentColor" /></button>
        </div>
      </div>
    </motion.div>
  );
};
