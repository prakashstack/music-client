import { useRef, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import {
  togglePlay, setProgress, setDuration,
  nextSong, prevSong, setVolume, toggleMute, setIsPlaying,
  toggleShuffle, cycleRepeat, playSong,
} from '../store/playerSlice';
import { historyService, musicApiBaseUrl } from '../services/api';
import type { Song } from '../types';

export const audioRef = { current: new Audio() };

export const usePlayer = () => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((s) => s.player);
  const playStartRef = useRef<number>(0);

  const play = useCallback((song: Song, queue?: Song[]) => {
    dispatch(playSong({ song, queue }));
  }, [dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!player.currentSong) return;
    const streamUrl = `${musicApiBaseUrl}/music/stream/${encodeURIComponent(player.currentSong.id)}`;
    const resolvedStreamUrl = new URL(streamUrl, window.location.origin).href;
    if (audio.src !== resolvedStreamUrl) {
      audio.dataset.streamFallbackAttempted = 'true';
      audio.src = streamUrl;
      audio.load();
    }
    if (player.isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.warn('Unable to play the audio stream:', err);
          dispatch(setIsPlaying(false));
        });
      }
      playStartRef.current = Date.now();
    } else {
      audio.pause();
    }
  }, [player.currentSong, player.isPlaying]);

  useEffect(() => {
    audioRef.current.volume = player.isMuted ? 0 : player.volume;
  }, [player.volume, player.isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => dispatch(setProgress(audio.currentTime));
    const handleDurationChange = () => dispatch(setDuration(audio.duration || 0));
    const handleError = () => {
      const fallbackUrl = `${musicApiBaseUrl}/music/stream/${encodeURIComponent(player.currentSong?.id || '')}`;
      if (audio.dataset.streamFallbackAttempted !== 'true' && audio.src !== fallbackUrl) {
        audio.dataset.streamFallbackAttempted = 'true';
        audio.src = fallbackUrl;
        audio.load();
        if (player.isPlaying) {
          audio.play().catch(() => dispatch(setIsPlaying(false)));
        }
        return;
      }
      console.warn('The audio stream could not be loaded.');
      dispatch(setIsPlaying(false));
    };
    const handleEnded = () => {
      if (player.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        if (player.currentSong) {
          const duration = player.duration || 1;
          const played = (player.progress / duration) * 100;
          historyService.recordPlay(
            player.currentSong.id,
            player.currentSong,
            Math.min(100, Math.round(played))
          ).catch(console.error);
        }
        dispatch(nextSong());
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [dispatch, player.isPlaying, player.repeatMode, player.currentSong, player.duration, player.progress]);

  const seek = useCallback((time: number) => {
    audioRef.current.currentTime = time;
    dispatch(setProgress(time));
  }, [dispatch]);

  return {
    ...player,
    play,
    seek,
    dispatch,
    togglePlay: () => dispatch(togglePlay()),
    nextSong: () => dispatch(nextSong()),
    prevSong: () => dispatch(prevSong()),
    setVolume: (v: number) => dispatch(setVolume(v)),
    toggleMute: () => dispatch(toggleMute()),
    toggleShuffle: () => dispatch(toggleShuffle()),
    cycleRepeat: () => dispatch(cycleRepeat()),
  };
};
