import React from "react";
import { cn } from "../../utils/helpers";

const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary-500 text-white hover:bg-primary-600",
      outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
      glass: "bg-white/20 backdrop-blur-md border border-white/40 text-gray-900 hover:bg-white/40 shadow-glass font-bold",
      "glass-primary": "bg-primary-500/10 backdrop-blur-md border border-primary-500/20 text-primary-600 hover:bg-primary-500/20 shadow-glass font-bold",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      "neon-primary": "bg-primary-500 text-white border-2 border-white/50 shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all font-black uppercase tracking-widest",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
