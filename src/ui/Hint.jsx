import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useJourney } from '../journey/store';

/**
 * The interaction is deliberate (input drives a camera, not a scrollbar), so a
 * one-time affordance is warranted. It leaves the moment the visitor moves, or
 * after a few seconds.
 */
export default function Hint() {
  const target = useJourney((s) => s.target);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (target > 0.02) setDismissed(true);
  }, [target]);

  useEffect(() => {
    const t = setTimeout(() => setDismissed(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.p
          className="fixed inset-x-0 bottom-7 z-30 text-center font-inscription text-[10px] uppercase tracking-[0.28em] text-ink/55"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Roll or arrow keys to walk the hall &nbsp;·&nbsp; drag to look around
        </motion.p>
      )}
    </AnimatePresence>
  );
}
