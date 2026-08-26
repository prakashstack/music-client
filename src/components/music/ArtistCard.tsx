import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getBestImage, MUSIC_PLACEHOLDER } from '../../utils';

interface ArtistCardProps {
  artist: any;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();
  const image = getBestImage(artist.image, 'lg');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer text-center p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all"
      onClick={() => navigate(`/search?q=${encodeURIComponent(artist.name)}`)}
    >
      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 bg-[#F4F4F5] border-2 border-[#E4E4E7] group-hover:border-[#FFDE21] transition-colors mx-auto shadow-sm">
        <img src={image || MUSIC_PLACEHOLDER} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onError={(event) => { event.currentTarget.src = MUSIC_PLACEHOLDER; }} />
      </div>
      <p className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{artist.name}</p>
      <p className="text-xs font-medium text-[#71717A] mt-0.5">Artist</p>
    </motion.div>
  );
};
