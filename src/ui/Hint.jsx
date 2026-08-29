import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useJourney } from '../journey/store';

const COARSE =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/**
 * The interaction is deliberate (input drives a camera, not a scrollbar), so a
 * one-time affordance is warranted - and it needs to be legible against the
 * bright marble, so it sits in a frosted pill with the key words emphasised.
 * It leaves the moment the visitor moves, or after a good long while.
 */
export default function Hint() {
  const target = useJourney((s) => s.target);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (target > 0.02) setDismissed(true);
  }, [target]);

  useEffect(() => {
    const t = setTimeout(() => setDismissed(true), 18000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-20 z-30 flex justify-center px-4 sm:bottom-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.55, delay: 0.6 }}
        >
          <motion.p
            className="rounded-full border border-ink/20 bg-white/85 px-5 py-3 text-center font-inscription text-[11px] uppercase tracking-[0.18em] text-ink/80 shadow-[0_10px_34px_rgba(35,39,44,0.2)] backdrop-blur-md sm:px-6 sm:text-[12px] sm:tracking-[0.2em]"
            animate={{ opacity: [1, 0.62, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {COARSE ? (
              <>
                <span className="font-semibold text-ink">Swipe</span> to walk the hall
                <span className="mx-2 text-ink/35">·</span>
                <span className="font-semibold text-ink">Drag sideways</span> to look
              </>
            ) : (
              <>
                <span className="font-semibold text-ink">Roll</span> or{' '}
                <span className="font-semibold text-ink">arrow keys</span> to walk the hall
                <span className="mx-2.5 text-ink/35">·</span>
                <span className="font-semibold text-ink">Drag</span> to look around
              </>
            )}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
