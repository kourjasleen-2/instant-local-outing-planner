import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { duration, ease, usePrefersReducedMotion } from '@/lib/motion';

/**
 * Entrance-only page transition, keyed by route location in App.tsx.
 * Deliberately skips exit animation: wouter swaps the matched route the
 * moment location changes, so an old page has already unmounted by the time
 * an exit animation could run without a location-snapshot dance. A clean,
 * fast entrance gets most of the perceived polish without that fragility or
 * any risk of a blank-screen flash between routes.
 */
export function PageTransition({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <>{children}</>;
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.large, ease }}
    >
      {children}
    </motion.div>
  );
}
