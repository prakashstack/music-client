import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import type { Genre } from '../../types';

export const GenreCard = ({ genre }: { genre: Genre }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="relative h-32 cursor-pointer overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white p-5 text-left shadow-sm transition-all hover:border-[#FFDE21] hover:shadow-lg hover:shadow-black/5"
      onClick={() => navigate(`/search?q=${encodeURIComponent(genre.name)}`)}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#FFDE21]" />
      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8C7] text-[#1A1A1A]">
        <Music2 size={20} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <span className="absolute bottom-5 left-5 text-lg font-bold tracking-tight text-[#1A1A1A]">{genre.name}</span>
    </motion.button>
  );
};
