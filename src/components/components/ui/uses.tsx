'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface UsesIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UsesIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const USES_VARIANTS: Variants = {
  normal: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.05, 0.98, 1.02, 1],
    transition: {
      duration: 1.6,
      ease: 'easeInOut',
    },
  },
};

const UsesIcon = forwardRef<UsesIconHandle, UsesIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, isAnimating, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    // Handle isAnimating prop
    React.useEffect(() => {
      if (isAnimating !== undefined) {
        isControlledRef.current = true;
        if (isAnimating) {
          controls.start('animate');
        } else {
          controls.start('normal');
        }
      }
    }, [isAnimating, controls]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        }
        onMouseEnter?.(e);
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        }
        onMouseLeave?.(e);
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={USES_VARIANTS}
          animate={controls}
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <path d="M2 17h20" />
          <path d="M6 20h12" />
        </motion.svg>
      </div>
    );
  }
);

UsesIcon.displayName = 'UsesIcon';

export { UsesIcon };
