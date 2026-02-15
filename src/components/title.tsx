import type { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <div className={`relative inline-block Blockletter ${className}`}>
      {/* BACK / OFFSET COPY */}
      <h1
        aria-hidden
        className="
          absolute inset-0
          translate-x-[4px] translate-y-[4px]
          md:translate-x-[8px] md:translate-y-[8px]
          text-primary
          mix-blend-exclusion
          [-webkit-text-stroke:0px_black]
          pointer-events-none
        "
      >
        {children}
      </h1>

      {/* FRONT COPY */}
      <h1
        className="
          relative
          text-white
          [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:4px_black]
        "
      >
        {children}
      </h1>
    </div>
  );
}
