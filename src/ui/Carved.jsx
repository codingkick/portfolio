import { motion, useReducedMotion } from 'motion/react';

/**
 * Chiselled-inscription reveal: words surface one by one out of a blur, as if
 * being cut into stone. Used for chamber headings. Falls back to a plain static
 * render under reduced motion.
 */
export function Carved({
  text,
  as = 'h2',
  className = '',
  delay = 0,
  stagger = 0.045,
  animateOnView = false,
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.h2;
  const words = String(text).split(' ');

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word = {
    hidden: { opacity: 0, y: '0.35em', filter: 'blur(7px)' },
    show: {
      opacity: 1,
      y: '0em',
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      {...(animateOnView
        ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } }
        : { animate: 'show' })}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block whitespace-pre">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
