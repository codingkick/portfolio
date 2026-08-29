import { useJourney } from '../journey/store';
import { chambers } from '../journey/chambers';

/**
 * Torch-lit dial: one marker per chamber down the right edge. The active one is
 * lit gold; click any marker to dolly straight to that chamber.
 */
export default function ProgressDial() {
  const active = useJourney((s) => s.active);
  const goto = useJourney((s) => s.goto);

  return (
    <nav
      aria-label="Hall chambers"
      className="fixed right-4 top-1/2 z-30 -translate-y-1/2 sm:right-7"
    >
      <ul className="flex flex-col items-end gap-4">
        {chambers.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => goto(i)}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={`font-inscription text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ${
                    on
                      ? 'text-flame opacity-100'
                      : 'text-ink/45 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {c.label}
                </span>
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span
                    className={`h-[7px] w-[7px] rotate-45 border transition-all duration-300 ${
                      on
                        ? 'border-flame bg-flame shadow-[0_0_12px_2px_rgba(255,122,40,0.55)]'
                        : 'border-ink/35 bg-transparent group-hover:border-flame/70'
                    }`}
                  />
                </span>
                <span className="font-inscription text-[9px] tracking-[0.1em] text-ink/35">
                  {c.marker}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
