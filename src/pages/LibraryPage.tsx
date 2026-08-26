import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Heart, History, Music } from 'lucide-react';

const sections = [
  { icon: Heart, label: 'Liked Songs', desc: 'All your favorite tracks', path: '/favorites', color: '#FFDE21' },
  { icon: History, label: 'Recently Played', desc: 'Your listening history', path: '/history', color: '#FFDE21' },
  { icon: Music, label: 'Explore Genres', desc: 'Discover music by genre', path: '/search', color: '#FFDE21' },
];

export const LibraryPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#FFDE21] flex items-center justify-center">
            <BookOpen size={20} className="text-[#1A1A1A]" />
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] text-[#F0F0FF]">Your Library</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sections.map(({ icon: Icon, label, desc, path, color }) => (
            <motion.div
              key={path}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => navigate(path)}
              className="glass rounded-2xl p-6 cursor-pointer hover:border-[#6C63FF]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${color}22` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-lg font-semibold font-['Outfit'] text-[#F0F0FF] mb-1">{label}</h3>
              <p className="text-sm text-[#8888AA]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
