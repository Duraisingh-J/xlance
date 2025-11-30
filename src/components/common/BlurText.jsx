import React from 'react';
import { motion } from 'framer-motion';

/**
 * BlurText
 * Splits text into words or characters and animates each item with a blur -> clear effect
 * Props:
 * - text: string
 * - delay: number (ms) delay between each item
 * - animateBy: 'words' | 'chars'
 * - direction: 'top' | 'bottom' | 'left' | 'right'
 * - onAnimationComplete: callback when entire sequence finishes
 * - className: additional tailwind classes
 */
const BlurText = ({
  text = '',
  delay = 120,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
}) => {
  const items =
    animateBy === 'chars'
      ? text.split('')
      : // words: preserve spaces as separate items so spacing stays natural
        text.split(/(\s+)/).filter(Boolean);

  const offsetMap = {
    top: { x: 0, y: -18 },
    bottom: { x: 0, y: 18 },
    left: { x: -12, y: 0 },
    right: { x: 12, y: 0 },
  };

  const offset = offsetMap[direction] || offsetMap.top;

  const container = {
    hidden: {},
    visible: {},
  };

  const child = (i) => ({
    hidden: { opacity: 0, x: offset.x, y: offset.y, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, delay: (i * delay) / 1000, ease: 'easeOut' },
    },
  });

  return (
    <span className={`inline-block ${className}`} aria-hidden={false}>
      {items.map((item, i) => {
        // If the item is whitespace, render a normal space without motion wrapper
        if (/^\s+$/.test(item)) {
          return (
            <span key={`sp-${i}`} className="whitespace-pre">
              {item}
            </span>
          );
        }

        return (
          <motion.span
            key={`${item}-${i}`}
            variants={container}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => {
              if (i === items.length - 1 && typeof onAnimationComplete === 'function') {
                onAnimationComplete();
              }
            }}
            style={{ display: 'inline-block' }}
            // apply the variant for this child index
            custom={i}
            // Use direct animate props so each child has its own delay
            initial={{ opacity: 0, x: offset.x, y: offset.y, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: (i * delay) / 1000, ease: 'easeOut' }}
            className="inline-block mr-0.5"
          >
            {item}
          </motion.span>
        );
      })}
    </span>
  );
};

export default BlurText;
