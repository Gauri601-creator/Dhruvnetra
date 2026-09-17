import React from 'react';
import { RiskLevel } from '../../types';

export type BadgeStatusType = 
  | RiskLevel 
  | 'OPERATIONAL' 
  | 'WARNING' 
  | 'OFFLINE' 
  | 'CONNECTED' 
  | 'LIVE' 
  | 'READY' 
  | 'DEGRADED' 
  | 'ADVISORY' 
  | 'INFO' 
  | 'DELAYED' 
  | 'NOMINAL';

interface StatusBadgeProps {
  status?: BadgeStatusType | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'LOW',
  label,
  size = 'md',
  pulse = false,
}) => {
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';
  const displayLabel = label || status;

  switch (status) {
    case 'LOW':
    case 'OPERATIONAL':
    case 'CONNECTED':
    case 'LIVE':
    case 'READY':
    case 'NOMINAL':
    case 'INFO':
      colorClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50';
      dotColor = 'bg-emerald-400';
      break;
    case 'MEDIUM':
    case 'WARNING':
    case 'DEGRADED':
    case 'ADVISORY':
    case 'DELAYED':
      colorClasses = 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-amber-950/50';
      dotColor = 'bg-amber-400';
      break;
    case 'HIGH':
    case 'CRITICAL':
    case 'OFFLINE':
      colorClasses = 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-rose-950/60';
      dotColor = 'bg-rose-400';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-2 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${colorClasses} ${sizeClasses} tracking-wider font-mono`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
};
