import { AnimatePresence, motion } from 'framer-motion';
import { duration, ease, usePrefersReducedMotion } from '@/lib/motion';

/**
 * Crossfades a formatted value (already-formatted strings like "₹620" or
 * "3h 20m") when it changes, keyed on the string itself. Used for plan-math
 * values that update after an edit/replace/delete/add/regenerate.
 *
 * Deliberately takes pre-formatted strings rather than animating the raw
 * number: GLIMMR's values carry units and formatting (₹, "m", "km") that a
 * numeric tween would need to reconstruct anyway, and a short slide+fade
 * reads as clearly as counting through intermediate values for these small,
 * infrequent deltas.
 */
export function ValueTransition({ value, className }: { value: string; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <span className={className}>{value}</span>;
  return (
    <span className={className} style={{ display: 'inline-grid', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, position: 'absolute' }}
          transition={{ duration: duration.interaction, ease }}
          style={{ gridArea: '1 / 1' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
