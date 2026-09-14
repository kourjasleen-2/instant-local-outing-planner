import { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { duration, ease, fadeUp, staggerContainer, usePrefersReducedMotion } from '@/lib/motion';

// Slightly more presence for a single highlighted item (e.g. the "Best fit"
// plan card) — small scale-up added on top of the standard fadeUp.
const fadeUpStrong: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: duration.content, ease } },
};

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, strong = false }: { children: ReactNode; className?: string; strong?: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={strong ? fadeUpStrong : fadeUp}>
      {children}
    </motion.div>
  );
}
