'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimationContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimationContainer: React.FC<AnimationContainerProps> = ({
  children,
  className = '',
}) => {
  // scrool to first child
  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    });
  }, []);

  return (
    <motion.div
      className={cn('w-full h-full', className)}
      initial={{ scale: 1 }}
      animate={{ 
        scale: [0.5, 1, 1],
        transition: {
          duration: 3,
          times: [0, 0.5, 1],
          ease: "easeInOut"
        }
      }}
    >
      {children}
    </motion.div>
  );
};
