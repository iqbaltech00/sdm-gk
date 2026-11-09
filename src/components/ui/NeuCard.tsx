import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function NeuCard({ children, className, interactive, ...props }: NeuCardProps) {
  return (
    <div
      className={cn(
        'neu-card',
        interactive && 'cursor-pointer hover:-translate-y-[3px] hover:shadow-[8px_8px_18px_#b8c2d1,-8px_-8px_18px_#ffffff]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NeuInset({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('neu-inset', className)} {...props}>
      {children}
    </div>
  );
}