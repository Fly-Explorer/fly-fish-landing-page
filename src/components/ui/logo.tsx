import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 40,
  height = 40,
  className = "",
}) => (
  <img
    src="/flyfish-logo.svg"
    width={width}
    height={height}
    alt="Fly Fish Logo"
    className={`
      transition duration-200
      group-hover:brightness-125
      group-hover:drop-shadow-[0_0_24px_rgba(0,143,245,0.45)]
      select-none
      ${className}
    `}
    draggable={false}
  />
);