import React from 'react';
import { cn } from '../../utils/helpers';

const Card = React.forwardRef(({ variant = 'glass', hover = true, className, children, ...props }, ref) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variantStyles = {
    glass: 'bg-white/70 backdrop-blur-xl border border-white/40 shadow-glass',
    'glass-light': 'bg-white/40 backdrop-blur-2xl border border-white/50 shadow-glass',
    'glass-dark': 'bg-black/60 backdrop-blur-2xl border border-white/10 text-white shadow-2xl',
    solid: 'bg-white shadow-sm border border-gray-100',
    outline: 'border-2 border-gray-200 bg-white',
  };

  const hoverStyles = hover ? 'hover:shadow-glass-lg hover:scale-105' : '';

  return (
    <div ref={ref} className={cn(baseStyles, variantStyles[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
