import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  accentColor?: 'cyan' | 'blue' | 'amber' | 'emerald' | 'rose';
  badge?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'cyan',
  badge,
  children,
  onClick,
  className = '',
}) => {
  const accentGlow = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400',
    blue: 'border-sky-500/20 hover:border-sky-500/40 text-sky-400',
    amber: 'border-amber-500/20 hover:border-amber-500/40 text-amber-400',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
    rose: 'border-rose-500/20 hover:border-rose-500/40 text-rose-400',
  }[accentColor];

  const iconBg = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-4 transition-all duration-200 ${accentGlow} ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-2 rounded-lg border ${iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
            {title}
          </span>
        </div>
        {badge && <div>{badge}</div>}
      </div>

      <div className="mt-1">
        <div className="text-xl font-bold font-orbitron tracking-wide text-slate-100">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-slate-400 mt-1 font-mono">{subtitle}</div>
        )}
      </div>

      {children && <div className="mt-3 pt-3 border-t border-slate-800/80">{children}</div>}
    </div>
  );
};
