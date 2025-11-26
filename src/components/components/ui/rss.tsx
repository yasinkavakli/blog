'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface RSSIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RSSIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const RSS_VARIANTS: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
  },
  animate: {
    scale: [1, 1.15, 1],
    rotate: [0, 360],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
    },
  },
};

const RSSIcon = forwardRef<RSSIconHandle, RSSIconProps>(
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
    useEffect(() => {
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
          variants={RSS_VARIANTS}
          animate={controls}
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </motion.svg>
      </div>
    );
  }
);

RSSIcon.displayName = 'RSSIcon';

export { RSSIcon };
