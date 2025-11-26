'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface StackIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface StackIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const STACK_VARIANTS: Variants = {
  normal: {
    y: 0,
  },
  animate: {
    y: [0, -2, 2, -1, 0],
    transition: {
      duration: 1.6,
      ease: 'easeInOut',
    },
  },
};

const StackIcon = forwardRef<StackIconHandle, StackIconProps>(
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
          variants={STACK_VARIANTS}
          animate={controls}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </motion.svg>
      </div>
    );
  }
);

StackIcon.displayName = 'StackIcon';

export { StackIcon };
