import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/motion';

const PRELOADER_KEY = 'glimmr-preloader-seen';
const messages = ['finding your moment...', 'shaping your plan...', 'ready when you are.'];

function shouldShowPreloader() {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(PRELOADER_KEY) !== 'true';
  } catch {
    return true;
  }
}

export default function GlimmrPreloader() {
  const [visible, setVisible] = useState(shouldShowPreloader);
  const [messageIndex, setMessageIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!visible) return;
    const finish = () => {
      try {
        window.sessionStorage.setItem(PRELOADER_KEY, 'true');
      } catch {
        // Session storage is an enhancement; the intro can still dismiss.
      }
      setVisible(false);
    };
    if (reducedMotion) {
      const timer = window.setTimeout(finish, 240);
      return () => window.clearTimeout(timer);
    }
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 360);
    const finishTimer = window.setTimeout(finish, 1250);
    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(finishTimer);
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;
  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Glimmr introduction">
      <div className="preloader-inner">
        <div className="preloader-mark" aria-hidden="true">G</div>
        <strong className="preloader-wordmark">glimmr</strong>
        <span className="preloader-message">{messages[messageIndex]}</span>
      </div>
    </div>
  );
}