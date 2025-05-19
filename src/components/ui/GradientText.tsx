import React from "react";

interface GradientLogoTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientLogoText: React.FC<GradientLogoTextProps> = ({ children, className = "" }) => (
  <span
    className={`
      font-aeonik font-black text-2xl md:text-4xl tracking-tight
      bg-gradient-to-r from-white via-[#70B9EE] to-[#008FF5]
      bg-clip-text text-transparent
      drop-shadow-[0_2px_16px_rgba(0,143,245,0.25)]
      [text-shadow:_0_2px_24px_rgba(0,143,245,0.25)]
      select-none
      transition duration-200
      group-hover:brightness-125
      group-hover:drop-shadow-[0_0_32px_rgba(0,143,245,0.55)]
      ${className}
    `}
  >
    {children}
  </span>
);