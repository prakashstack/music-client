import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, History, BookOpen } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/history', icon: History, label: 'History' },
];

export const MobileNav = () => (
  <nav
    className="md:hidden fixed bottom-[76px] left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E4E4E7] flex justify-around py-2 shadow-[0_-8px_24px_rgba(24,24,27,.08)]"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    {navItems.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
            isActive ? 'bg-[#FFDE21] text-[#1A1A1A] font-bold' : 'text-[#71717A] font-medium'
          }`
        }
      >
        <Icon size={22} />
        <span className="text-[11px]">{label}</span>
      </NavLink>
    ))}
  </nav>
);
