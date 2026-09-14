import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/motion';

const phrases = [
  'Find something good.',
  'Go somewhere new.',
  'Make the next few hours count.',
  "Let's figure out what to do.",
  'Less browsing. More being there.',
];

export default function TextLoop() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % phrases.length), 3600);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    // aria-hidden: this is decorative rotating marketing copy next to a
    // static heading that already says the same thing in other words.
    // Re-announcing a new phrase to screen readers every 3.6s would be
    // exactly the "continuously announce animated text changes" pattern
    // the motion spec calls out to avoid.
    <div className="text-loop" aria-hidden="true">
      <span className="text-loop-label">right now</span>
      <span className="text-loop-phrase" key={reducedMotion ? 'static' : phrases[index]}>{phrases[index]}</span>
    </div>
  );
}