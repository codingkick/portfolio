import { useJourney } from '../journey/store';
import { chambers } from '../journey/chambers';

/**
 * Torch-lit dial: one marker per chamber. On desktop it runs down the right edge;
 * on a phone the panel is full-width, so it becomes a compact horizontal row
 * pinned to the bottom. The active marker is lit gold; tap any marker to dolly
 * straight to that chamber.
 */
export default function ProgressDial() {
  const active = useJourney((s) => s.active);
  const goto = useJourney((s) => s.goto);

  return (
    <nav
      aria-label="Hall chambers"
      className="fixed left-1/2 bottom-3 z-30 -translate-x-1/2 sm:left-auto sm:right-7 sm:top-1/2 sm:bottom-auto sm:translate-x-0 sm:-translate-y-1/2"
    >
      <ul className="flex flex-row items-center gap-5 rounded-full border border-ink/15 bg-white/70 px-4 py-2 backdrop-blur-md sm:flex-col sm:items-end sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        {chambers.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => goto(i)}
                aria-current={on ? 'true' : undefined}
                aria-label={c.label}
                className="group flex items-center gap-3"
              >
                <span
                  className={`hidden font-inscription text-[10px] uppercase tracking-[0.16em] transition-all duration-300 sm:inline ${
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
                <span className="hidden font-inscription text-[9px] tracking-[0.1em] text-ink/35 sm:inline">
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
