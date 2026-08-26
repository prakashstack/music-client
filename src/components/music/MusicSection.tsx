import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Song, Genre, HomeSection } from '../../types';
import { SongCard } from './SongCard';
import { GenreCard } from './GenreCard';
import { ArtistCard } from './ArtistCard';

interface MusicSectionProps {
  section: HomeSection;
}

export const MusicSection = ({ section }: MusicSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-14"
    >
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold font-['Outfit'] text-[#1A1A1A] tracking-tight">{section.title}</h2>
          {section.subtitle && <p className="text-sm font-medium text-[#71717A] mt-1">{section.subtitle}</p>}
        </div>
        {section.type !== 'genres' && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] hover:bg-[#FFDE21] hover:border-[#FFDE21] flex items-center justify-center transition-all text-[#1A1A1A] cursor-pointer shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] hover:bg-[#FFDE21] hover:border-[#FFDE21] flex items-center justify-center transition-all text-[#1A1A1A] cursor-pointer shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {section.type === 'genres' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {section.items.map((genre: Genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      ) : section.type === 'artists' ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {section.items.map((artist: any) => (
            <div key={artist.id} className="flex-shrink-0 w-36">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {section.items.map((song: Song) => (
            <div key={song.id} className="flex-shrink-0 w-44 sm:w-48">
              <SongCard song={song} queue={section.items as Song[]} />
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};
