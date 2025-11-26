'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface ShareIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ShareIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const SHARE_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    scale: 1,
  },
  animate: {
    rotate: [0, -10, 8, -5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
    },
  },
};

const ShareIcon = forwardRef<ShareIconHandle, ShareIconProps>(
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
          variants={SHARE_VARIANTS}
          animate={controls}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </motion.svg>
      </div>
    );
  }
);

ShareIcon.displayName = 'ShareIcon';

export { ShareIcon };
