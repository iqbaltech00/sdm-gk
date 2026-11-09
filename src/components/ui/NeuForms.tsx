import React, { forwardRef } from 'react';
import { cn } from './NeuCard';

export const NeuInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-neu-bg border border-white/30 rounded-xl text-neu-text px-3.5 py-2.5 text-sm transition-all duration-200 outline-none",
          "shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]",
          "focus:border-neu-primary focus:shadow-[inset_4px_4px_8px_#b8c2d1,inset_-4px_-4px_8px_#ffffff,0_0_0_2px_rgba(59,130,246,0.3)]",
          className
        )}
        {...props}
      />
    );
  }
);
NeuInput.displayName = 'NeuInput';

export const NeuSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full bg-neu-bg border border-white/30 rounded-xl text-neu-text px-3.5 py-2.5 text-sm transition-all duration-200 outline-none appearance-none",
          "shadow-[inset_3px_3px_6px_#b8c2d1,inset_-3px_-3px_6px_#ffffff]",
          "focus:border-neu-primary focus:shadow-[inset_4px_4px_8px_#b8c2d1,inset_-4px_-4px_8px_#ffffff,0_0_0_2px_rgba(59,130,246,0.3)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
NeuSelect.displayName = 'NeuSelect';