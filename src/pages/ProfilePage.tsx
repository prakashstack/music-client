import { motion } from 'framer-motion';
import { useAppSelector } from '../hooks/useAppDispatch';
import { Heart, Calendar } from 'lucide-react';

export const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const favCount = useAppSelector((s) => s.favorites.items.length);

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-['Outfit'] text-[#F0F0FF] mb-8">Profile</h1>
        <div className="glass rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-6">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-[#6C63FF]/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6B9D] flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.[0]}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-[#F0F0FF]">{user?.name}</h2>
              <p className="text-[#8888AA]">{user?.email}</p>
              <p className="text-xs text-[#555577] mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Heart, label: 'Favorites', value: favCount, color: '#FF6B9D' },
            { icon: Calendar, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '—', color: '#6C63FF' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-5">
              <Icon size={20} style={{ color }} className="mb-3" />
              <p className="text-2xl font-bold font-['Outfit'] text-[#F0F0FF]">{value}</p>
              <p className="text-sm text-[#8888AA]">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
