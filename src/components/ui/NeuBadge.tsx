import React from 'react';
import { cn } from './NeuCard';

interface NeuBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
}

export function NeuBadge({ children, className, variant = 'primary', ...props }: NeuBadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-emerald-100 text-emerald-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-900',
    info: 'bg-cyan-100 text-cyan-900',
    dark: 'bg-slate-200 text-slate-800'
  };

  return (
    <span 
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold shadow-[2px_2px_5px_#b8c2d1,-2px_-2px_5px_#ffffff] inline-block", 
        variants[variant], 
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}