import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music4, Zap, Heart, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppDispatch';

export const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/home', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const features = [
    { icon: Zap, label: 'AI Personalization', desc: 'Music that learns your taste' },
    { icon: Heart, label: 'Save Favorites', desc: 'Build your perfect collection' },
    { icon: TrendingUp, label: 'Trending Now', desc: 'Discover what is hot today' },
  ];

  return (
    <div className="login-page min-h-screen bg-[#F9F9FB] flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative bg-[#1A1A1A]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FFDE21]/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-[#71717A]/30 blur-3xl" />
        </div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFDE21] flex items-center justify-center shadow-lg shadow-black/20">
                <Music4 size={24} className="text-[#1A1A1A]" />
              </div>
              <span className="text-3xl font-bold font-['Outfit'] text-white">Resonance</span>
            </div>
            <h1 className="text-5xl font-bold font-['Outfit'] text-white leading-tight mb-4">
              Your Music.<br />
              <span className="text-[#FFDE21]">Your Vibe.</span><br />
              Your AI DJ.
            </h1>
            <p className="text-[#D4D4D8] text-lg leading-relaxed mb-10 max-w-xl">
              Discover millions of songs personalized by AI to your unique taste.
              The more you listen, the better it gets.
            </p>
            <div className="space-y-4">
              {features.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <Icon size={18} className="text-[#FFDE21]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-[#D4D4D8]">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#FFDE21] flex items-center justify-center">
              <Music4 size={20} className="text-[#1A1A1A]" />
            </div>
            <span className="text-2xl font-bold font-['Outfit'] text-[#1A1A1A]">Resonance</span>
          </div>

          <div className="glass rounded-3xl p-8 sm:p-10 shadow-xl shadow-black/5">
            <div className="h-1 w-12 rounded-full bg-[#FFDE21] mb-6" />
            <h2 className="text-3xl font-bold font-['Outfit'] text-[#1A1A1A] mb-2">Welcome back</h2>
            <p className="text-[#71717A] text-sm mb-8">Sign in to continue your music journey</p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#FFDE21] text-[#1A1A1A] rounded-2xl py-3.5 px-6 font-semibold text-sm hover:bg-[#F2C900] transition-colors shadow-sm cursor-pointer"
              id="google-login-btn"
              aria-label="Continue with Google"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            <p className="text-center text-xs leading-relaxed text-[#71717A] mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <p className="text-center text-xs text-[#71717A] mt-6">
            Resonance • AI-Powered Music Streaming
          </p>
        </motion.div>
      </div>
    </div>
  );
};
