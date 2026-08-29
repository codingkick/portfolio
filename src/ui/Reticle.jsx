import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAim } from '../three/aimStore';

/**
 * An aiming crosshair that rides the mouse pointer. It fades in on its own
 * whenever the ray through the pointer meets the flowing canal; the four corner
 * brackets pull inward and turn crimson when they frame a fish. Click to strike
 * it and it leaps clear of the water. Purely presentational - every decision
 * lives in Canal.jsx.
 */
export default function Reticle() {
  const visible = useAim((s) => s.visible);
  const locked = useAim((s) => s.locked);
  const hits = useAim((s) => s.hits);
  const wrap = useRef(null);

  // Follow the pointer without re-rendering on every mousemove.
  useEffect(() => {
    const onMove = (e) => {
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const c = locked ? '#e63212' : 'rgba(35,39,44,0.72)';
  const gap = locked ? 9 : 15;
  const len = 11;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div ref={wrap} style={{ position: 'absolute', left: 0, top: 0, willChange: 'transform' }}>
        <AnimatePresence>
          {visible && (
            <motion.div
              key="reticle"
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: locked ? 1 : 0.9 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ position: 'absolute', left: -27, top: -27, width: 54, height: 54 }}
            >
              {[
                { x: -1, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: 1 },
              ].map((k, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    left: k.x < 0 ? `calc(50% - ${gap}px - ${len}px)` : `calc(50% + ${gap}px)`,
                    top: k.y < 0 ? `calc(50% - ${gap}px - ${len}px)` : `calc(50% + ${gap}px)`,
                    width: len,
                    height: len,
                    borderTop: k.y < 0 ? `2px solid ${c}` : 'none',
                    borderBottom: k.y > 0 ? `2px solid ${c}` : 'none',
                    borderLeft: k.x < 0 ? `2px solid ${c}` : 'none',
                    borderRight: k.x > 0 ? `2px solid ${c}` : 'none',
                    transition: 'border-color 0.15s linear',
                  }}
                />
              ))}
              {/* centre dot */}
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 3,
                  height: 3,
                  marginLeft: -1.5,
                  marginTop: -1.5,
                  borderRadius: '50%',
                  background: c,
                  transition: 'background 0.15s linear',
                }}
              />
              {/* hit pulse */}
              <AnimatePresence>
                {hits > 0 && (
                  <motion.span
                    key={hits}
                    initial={{ opacity: 0.5, scale: 0.4 }}
                    animate={{ opacity: 0, scale: 2.1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 6,
                      borderRadius: '50%',
                      border: '2px solid #e63212',
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
