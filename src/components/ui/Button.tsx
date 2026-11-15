import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

const variants: Record<Variant, string> = {
  primary: "bg-terracotta text-ink",
  secondary: "bg-paper text-ink",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: Props) {
  return (
    <button
      className={cn(
        "min-h-12 cursor-pointer rounded-xl border-[3px] border-ink px-6 font-ui font-bold shadow-brutal",
        "hover:bg-terracotta/90",
        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm",
        "disabled:opacity-50 disabled:shadow-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
