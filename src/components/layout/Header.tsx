import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, LogOut, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { clearAuth, logout } from '../../store/authSlice';
import { setQuery, addRecentSearch } from '../../store/searchSlice';
import toast from 'react-hot-toast';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [searchInput, setSearchInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    dispatch(setQuery(q));
    dispatch(addRecentSearch(q));
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      dispatch(clearAuth());
    } finally {
      toast.success('Logged out');
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="flex items-center gap-4 px-5 py-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7] sticky top-0 z-40">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-[#71717A] pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full bg-[#F4F4F5] border border-transparent text-[#1A1A1A] placeholder-[#71717A] rounded-full py-2.5 pl-11 pr-10 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/30 transition-all"
            aria-label="Search music"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-3.5 text-[#71717A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* User Profile Badge */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setShowProfile((v) => !v)}
          className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full bg-white border border-[#E4E4E7] hover:border-[#FFDE21] transition-all cursor-pointer shadow-sm"
          aria-label="Profile menu"
          aria-expanded={showProfile}
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FFDE21]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#FFDE21] flex items-center justify-center font-bold text-[#1A1A1A] text-sm shadow-sm">
              {user?.name?.[0] || 'U'}
            </div>
          )}
          <span className="hidden sm:inline text-sm font-semibold text-[#1A1A1A] max-w-[120px] truncate">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          <ChevronDown size={16} className={`text-[#71717A] transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-13 w-60 bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden shadow-xl shadow-black/10 z-50 p-2"
            >
              <div className="px-3 py-2.5 border-b border-[#E4E4E7] mb-1">
                <p className="text-sm font-bold text-[#1A1A1A] truncate">{user?.name}</p>
                <p className="text-xs text-[#71717A] truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/profile'); setShowProfile(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#52525B] hover:text-[#1A1A1A] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
              >
                <User size={16} className="text-[#71717A]" /> Profile
              </button>
              <div className="my-1 border-t border-[#E4E4E7]" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#F43F5E] hover:bg-[#F43F5E]/15 transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
