import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#FF6B9D] flex items-center justify-center animate-pulse">
            <span className="text-2xl">??</span>
          </div>
          <p className="text-[#8888AA] text-sm">Loading Resonance...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
