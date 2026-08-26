import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { historyService } from '../services/api';
import { SongCard } from '../components/music/SongCard';
import { EmptyState } from '../components/common/EmptyState';
import { SectionSkeleton } from '../components/common/Skeleton';

export const HistoryPage = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['playHistory'],
    queryFn: () => historyService.getPlays(),
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFDE21] flex items-center justify-center">
            <History size={20} className="text-[#1A1A1A]" />
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] text-[#F0F0FF]">Recently Played</h1>
        </div>
      </motion.div>

      {isLoading ? <SectionSkeleton /> : !history?.length ? (
        <EmptyState icon={History} title="No history yet" subtitle="Songs you listen to will appear here." />
      ) : (
        <div className="space-y-1">
          {history.map((entry: any, i: number) => (
            entry.songData?.id ? (
              <SongCard key={entry._id || i} song={entry.songData} variant="list" index={i} />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};
