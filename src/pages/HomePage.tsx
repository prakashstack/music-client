import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { recommendationsService } from '../services/api';
import { MusicSection } from '../components/music/MusicSection';
import { SectionSkeleton } from '../components/common/Skeleton';
import { useAppSelector } from '../hooks/useAppDispatch';

export const HomePage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const { data: sections, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsService.getSections,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div>
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-3xl border border-[#E4E4E7] bg-white px-6 py-7 shadow-sm sm:px-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] tracking-tight text-[#1A1A1A]">
          {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} ✨
        </h1>
        <p className="mt-2 text-[#71717A]">What would you like to listen to today?</p>
      </motion.div>

      {/* Sections */}
      {isLoading ? (
        <>
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </>
      ) : sections?.length > 0 ? (
        sections.map((section: any, i: number) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <MusicSection section={section} />
          </motion.div>
        ))
      ) : (
        <div className="text-center py-20">
          <p className="text-[#71717A]">Unable to load music. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-[#FFDE21] px-6 py-2.5 text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F2C900] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
