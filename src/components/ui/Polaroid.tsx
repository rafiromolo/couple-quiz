import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  caption?: string;
  tilt?: number;
  develop?: boolean;
  className?: string;
  children: ReactNode;
};

export function Polaroid({ caption, tilt = -1, develop = false, className, children }: Props) {
  return (
    <figure
      className={cn(
        "w-full max-w-xs rounded-sm border-[3px] border-ink bg-paper p-3 shadow-brutal",
        className,
      )}
      style={{ rotate: `${tilt}deg` }}
    >
      <div
        className={cn(
          "flex aspect-square items-center justify-center border-2 border-ink bg-sand/40 p-6",
          develop && "develop",
        )}
      >
        {children}
      </div>
      <figcaption className="mt-3 min-h-10 font-hand text-xl text-cocoa">{caption}</figcaption>
    </figure>
  );
}
