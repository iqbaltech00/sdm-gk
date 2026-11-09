import React from 'react';
import { cn } from './NeuCard';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger';
}

export function NeuButton({ children, className, variant = 'default', ...props }: NeuButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-[0.88rem] transition-all duration-200";
  
  const variants = {
    default: "bg-neu-bg text-neu-text border border-white/70 shadow-[4px_4px_10px_#b8c2d1,-4px_-4px_10px_#ffffff] hover:text-neu-primary hover:shadow-[6px_6px_12px_#b8c2d1,-6px_-6px_12px_#ffffff] hover:-translate-y-[1px] active:shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff] active:translate-y-0",
    primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-[4px_4px_10px_rgba(37,99,235,0.35),-3px_-3px_8px_#ffffff] hover:from-blue-600 hover:to-blue-700",
    success: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-[4px_4px_10px_rgba(5,150,105,0.35),-3px_-3px_8px_#ffffff]",
    danger: "bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-[4px_4px_10px_rgba(220,38,38,0.35),-3px_-3px_8px_#ffffff]"
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}