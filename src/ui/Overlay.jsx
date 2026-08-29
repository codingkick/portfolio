import { AnimatePresence, motion } from 'motion/react';
import { useJourney } from '../journey/store';
import { chambers } from '../journey/chambers';
import ChamberPanel from './ChamberPanel';

/**
 * The 2D layer riding above the 3D hall. Only the settled chamber's tablet is
 * mounted; as the camera arrives in the next chamber the old tablet fades out
 * while the new one fades in, so text and travel change together.
 */
export default function Overlay() {
  const active = useJourney((s) => s.active);
  const chamber = chambers[active] || chambers[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(232,237,240,0.55) 0%, rgba(232,237,240,0.18) 42%, rgba(232,237,240,0) 66%)',
        }}
      />
      <AnimatePresence>
        <motion.div
          key={chamber.id}
          className="pointer-events-auto absolute left-4 right-4 top-1/2 sm:left-10 sm:right-auto sm:w-[min(92vw,44rem)] lg:left-16"
          initial={{ opacity: 0, y: '-42%', filter: 'blur(7px)' }}
          animate={{ opacity: 1, y: '-50%', filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: '-58%', filter: 'blur(7px)' }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ChamberPanel id={chamber.id} scroll />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
