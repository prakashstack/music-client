import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchFavorites } from '../store/favoritesSlice';
import { SongCard } from '../components/music/SongCard';
import { EmptyState } from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useAppSelector((s) => s.favorites);

  useEffect(() => { dispatch(fetchFavorites()); }, [dispatch]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFDE21] flex items-center justify-center">
            <Heart size={20} className="text-[#1A1A1A]" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-['Outfit'] text-[#F0F0FF]">Favorites</h1>
            <p className="text-[#8888AA] text-sm">{items.length} song{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          subtitle="Your favorite songs will appear here. Start liking songs to build your collection."
          action={{ label: 'Explore Music', onClick: () => navigate('/home') }}
        />
      ) : (
        <div className="space-y-1">
          {items.map((song: any, i: number) => (
            <SongCard key={song.id} song={song} queue={items} variant="list" index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
