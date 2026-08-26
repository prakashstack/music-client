import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon: Icon, title, subtitle, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-full bg-[#FFF8C7] border border-[#FFDE21] flex items-center justify-center mb-6">
      <Icon size={34} className="text-[#1A1A1A]" />
    </div>
    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{title}</h3>
    {subtitle && <p className="text-[#71717A] text-sm max-w-xs">{subtitle}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 px-6 py-2.5 bg-[#FFDE21] text-[#1A1A1A] rounded-full text-sm font-semibold hover:bg-[#F2C900] transition-colors cursor-pointer"
      >
        {action.label}
      </button>
    )}
  </div>
);
