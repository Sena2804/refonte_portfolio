import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export function Marquee({ children, speed = 50, className }: Props) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      aria-hidden
    >
      <div
        className="flex w-max [animation:marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center gap-14 pr-14">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-14 pr-14">
          {children}
        </div>
      </div>
    </div>
  );
}
