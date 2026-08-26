import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, BookOpen, History, Music4 } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/history', icon: History, label: 'History' },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E4E4E7] min-h-full flex-shrink-0 z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E4E4E7]">
        <NavLink to="/home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#FFDE21] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Music4 size={20} className="text-[#1A1A1A]" />
          </div>
          <span className="text-2xl font-bold font-['Outfit'] text-[#1A1A1A] tracking-tight">Resonance</span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 py-6 flex-1">
        <p className="px-3 text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Menu</p>
        <div className="space-y-1.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFDE21] text-[#1A1A1A] shadow-sm'
                    : 'text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#F4F4F5]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'text-[#1A1A1A]' : 'text-[#71717A]'} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </aside>
  );
};
