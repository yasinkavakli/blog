'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/components/lib/utils';

export interface MessageCircleIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MessageCircleIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isAnimating?: boolean;
}

const iconVariants: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
  },
  animate: {
    scale: 1.05,
    rotate: [0, -7, 7, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: 'easeInOut',
      },
      scale: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  },
};

const MessageCircleIcon = forwardRef<
  MessageCircleIconHandle,
  MessageCircleIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, isAnimating, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  });

  // Handle external isAnimating prop
  React.useEffect(() => {
    if (isAnimating !== undefined) {
      if (isAnimating) {
        controls.start('animate');
      } else {
        controls.start('normal');
      }
    }
  }, [isAnimating, controls]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && isAnimating === undefined) {
        controls.start('animate');
      } else {
        onMouseEnter?.(e);
      }
    },
    [controls, onMouseEnter, isAnimating]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && isAnimating === undefined) {
        controls.start('normal');
      } else {
        onMouseLeave?.(e);
      }
    },
    [controls, onMouseLeave, isAnimating]
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
        variants={iconVariants}
        animate={controls}
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </motion.svg>
    </div>
  );
});

MessageCircleIcon.displayName = 'MessageCircleIcon';

export { MessageCircleIcon };
