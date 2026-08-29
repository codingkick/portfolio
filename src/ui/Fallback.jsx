import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { chambers } from '../journey/chambers';
import ChamberPanel from './ChamberPanel';

/**
 * Reduced-motion / low-power / small-screen route. Same chambers, same marble
 * tablets, same carved type: a vertical sequence you scroll normally, with a
 * gentle crossfade between chamber grounds instead of a moving camera.
 */
export default function Fallback() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    document.querySelectorAll('[data-chamber]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const grounds = [
    'linear-gradient(160deg,#eef2f4,#dbe1e3)',
    'linear-gradient(160deg,#e9eef1,#d3dadd)',
    'linear-gradient(160deg,#eef1f0,#dde1de)',
    'linear-gradient(160deg,#f0f0ec,#dedfda)',
    'linear-gradient(160deg,#ebeff2,#d6dcde)',
    'linear-gradient(160deg,#f1ede6,#dcd9d2)',
  ];

  return (
    <div className="relative min-h-[100dvh] text-ink">
      {/* crossfading ground */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{ background: grounds[active] || grounds[0] }}
        transition={{ duration: reduce ? 0 : 1.1, ease: 'easeInOut' }}
      />
      <div className="marble-field pointer-events-none fixed inset-0 -z-10 opacity-40" />

      {/* chamber index */}
      <nav className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
        <ul className="flex flex-col gap-3">
          {chambers.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className={`flex items-center gap-2 font-inscription text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  i === active ? 'text-flame' : 'text-ink-soft/50 hover:text-ink-soft'
                }`}
              >
                <span className="w-6">{c.marker}</span>
                <span className={i === active ? 'opacity-100' : 'opacity-0'}>{c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {chambers.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            data-chamber
            data-index={i}
            className="flex min-h-[100dvh] items-center justify-center px-4 py-24 sm:px-8"
          >
            <ChamberPanel id={c.id} viewReveal />
          </section>
        ))}
      </main>
    </div>
  );
}
