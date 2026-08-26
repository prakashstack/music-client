import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Music, Disc, Mic2, X } from 'lucide-react';
import { musicService, historyService } from '../services/api';
import { SongCard } from '../components/music/SongCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { GenreCard } from '../components/music/GenreCard';
import { SongCardSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import type { Genre, Song } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addRecentSearch } from '../store/searchSlice';

type Tab = 'all' | 'songs' | 'artists' | 'albums';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const initialQ = searchParams.get('q') || '';
  const [input, setInput] = useState(initialQ);
  const debouncedQ = useDebounce(input, 400);
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    if (debouncedQ) {
      setSearchParams({ q: debouncedQ });
      dispatch(addRecentSearch(debouncedQ));
      historyService.recordSearch(debouncedQ).catch(() => {});
    }
  }, [debouncedQ]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQ, tab],
    queryFn: () => musicService.search(debouncedQ, tab),
    enabled: debouncedQ.length > 1,
    staleTime: 1000 * 60,
  });

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: musicService.getGenres,
    staleTime: Infinity,
  });

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Search size={14} /> },
    { key: 'songs', label: 'Songs', icon: <Music size={14} /> },
    { key: 'albums', label: 'Albums', icon: <Disc size={14} /> },
    { key: 'artists', label: 'Artists', icon: <Mic2 size={14} /> },
  ];

  const songs: Song[] = results?.songs || [];
  const albums = results?.albums || [];
  const artists = results?.artists || [];

  return (
    <div>
      <h1 className="text-3xl font-bold font-['Outfit'] text-[#1A1A1A] mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-6 max-w-2xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search songs, artists, albums, genres..."
          className="w-full bg-white border border-[#E4E4E7] text-[#1A1A1A] placeholder-[#71717A] rounded-2xl py-3.5 pl-12 pr-12 text-base focus:outline-none focus:border-[#FFDE21] transition-all shadow-sm"
          autoFocus
        />
        {input && (
          <button onClick={() => setInput('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8888AA] hover:text-white cursor-pointer" aria-label="Clear">
            <X size={16} />
          </button>
        )}
      </div>

      {/* No query - show genres */}
      {!debouncedQ && (
        <>
          <h2 className="text-lg font-semibold font-['Outfit'] text-[#1A1A1A] mb-4">Browse Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(genres as Genre[] || []).map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </>
      )}

      {/* Results */}
      {debouncedQ && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  tab === key
                    ? 'bg-[#FFDE21] text-[#1A1A1A]'
                    : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#1A1A1A] hover:border-[#FFDE21]'
                }`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <SongCardSkeleton key={i} />)}
            </div>
          ) : songs.length === 0 && albums.length === 0 && artists.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No results found"
              subtitle={`No music found for "${debouncedQ}". Try a different search term.`}
            />
          ) : (
            <div className="space-y-8">
              {/* Songs */}
              {songs.length > 0 && (tab === 'all' || tab === 'songs') && (
                <section>
                  <h2 className="text-lg font-semibold font-['Outfit'] text-[#1A1A1A] mb-4">Songs</h2>
                  <div className="space-y-1">
                    {songs.slice(0, tab === 'all' ? 5 : 20).map((song, i) => (
                      <SongCard key={song.id} song={song} queue={songs} variant="list" index={i} />
                    ))}
                  </div>
                </section>
              )}
              {/* Artists */}
              {artists.length > 0 && (tab === 'all' || tab === 'artists') && (
                <section>
                  <h2 className="text-lg font-semibold font-['Outfit'] text-[#1A1A1A] mb-4">Artists</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {artists.slice(0, tab === 'all' ? 6 : 20).map((artist: any) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </section>
              )}
              {/* Albums */}
              {albums.length > 0 && (tab === 'all' || tab === 'albums') && (
                <section>
                  <h2 className="text-lg font-semibold font-['Outfit'] text-[#1A1A1A] mb-4">Albums</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {albums.slice(0, tab === 'all' ? 6 : 20).map((album: any) => (
                      <motion.div
                        key={album.id}
                        whileHover={{ y: -4 }}
                        className="cursor-pointer group"
                        onClick={() => {}}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-[#F4F4F5] border border-[#E4E4E7] mb-2">
                          {album.image?.[2]?.url ? (
                            <img src={album.image[2].url} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                          ) : <div className="w-full h-full flex items-center justify-center text-3xl">??</div>}
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{album.name}</p>
                        <p className="text-xs text-[#71717A]">{album.artists?.primary?.[0]?.name || 'Various'}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
