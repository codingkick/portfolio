import { useEffect, useState } from 'react';

/**
 * In-theme loader. The column assembly and text pulse are pure CSS, so they keep
 * running even while the main thread compiles the first WebGL frame. The curtain
 * only lifts once the scene reports ready (`hall-ready`), or after a hard cap.
 */
export default function Loader() {
  const [lift, setLift] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setLift(true);
    };
    window.addEventListener('hall-ready', go, { once: true });
    const cap = setTimeout(go, 14000);
    return () => {
      window.removeEventListener('hall-ready', go);
      clearTimeout(cap);
    };
  }, []);

  return (
    <div
      className={`hall-loader marble-field fixed inset-0 z-[80] flex flex-col items-center justify-center${
        lift ? ' lift' : ''
      }`}
      aria-hidden="true"
    >
      <div className="relative flex h-40 w-24 flex-col-reverse items-center gap-1">
        <span className="drum block h-9 w-16 bg-[#aab0b3]" />
        <span className="drum block h-9 w-16 bg-[#aab0b3]" />
        <span className="drum block h-9 w-16 bg-[#aab0b3]" />
        <span className="cap absolute -top-3 h-3 w-20 bg-[#c9cdce]" />
      </div>
      <p className="pulse mt-10 font-inscription text-[11px] uppercase tracking-[0.3em] text-flame">
        Lighting the hall
      </p>
    </div>
  );
}
