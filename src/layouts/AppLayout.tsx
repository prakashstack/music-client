import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { MusicPlayer } from '../components/player/MusicPlayer';
import { useAppSelector } from '../hooks/useAppDispatch';

export const AppLayout = () => {
  const hasPlayer = useAppSelector((s) => !!s.player.currentSong);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F9FB] text-[#1A1A1A]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: hasPlayer ? '80px' : '0' }}
        >
          <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
      <MusicPlayer />
    </div>
  );
};
