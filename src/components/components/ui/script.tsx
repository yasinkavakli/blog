'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface ScriptIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ScriptIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const SCRIPT_VARIANTS: Variants = {
  normal: {
    y: 0,
  },
  animate: {
    y: [0, -3, 3, -2, 0],
    transition: {
      duration: 1.6,
      ease: 'easeInOut',
    },
  },
};

const ScriptIcon = forwardRef<ScriptIconHandle, ScriptIconProps>(
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
          variants={SCRIPT_VARIANTS}
          animate={controls}
        >
          <path d="M9 7H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
          <path d="M9 14h6" />
          <path d="M9 18h6" />
        </motion.svg>
      </div>
    );
  }
);

ScriptIcon.displayName = 'ScriptIcon';

export { ScriptIcon };
