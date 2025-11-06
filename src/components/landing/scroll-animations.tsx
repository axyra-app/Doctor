'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
}

export function ScrollFadeIn({ children, className }: ScrollAnimationProps) {
  const { scrollYProgress } = useScroll({
    target: { current: null },
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0]);

  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function ParallaxSection({ children, speed = 0.5, className }: ScrollAnimationProps & { speed?: number }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function ScaleOnScroll({ children, className }: ScrollAnimationProps) {
  const { scrollYProgress } = useScroll({
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <motion.div style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

