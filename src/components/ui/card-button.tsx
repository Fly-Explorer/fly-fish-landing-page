'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  backgroundColorHover?: string;
  rotateOnHover?: boolean;
}

export const CardButton: React.FC<CardButtonProps> = ({
  children,
  className = '',
  tooltip,
  backgroundColorHover = 'var(--color-background)',
  rotateOnHover = true,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {tooltip && (
        <div
          className={cn(
            'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1',
            'bg-gray-800 text-white text-sm rounded',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'whitespace-nowrap'
          )}
        >
          {tooltip}
        </div>
      )}
      <button
        className={cn(
          'relative px-4 py-2 rounded-lg transition-all duration-300',
          'hover:scale-105 active:scale-95',
          className
        )}
        style={{
          transform: rotateOnHover && isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
          backgroundColor: isHovered ? backgroundColorHover : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
