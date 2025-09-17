"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "secondary":
      return "bg-neutral-100 dark:bg-neutral-900 text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800";
    case "outline":
      return "border border-neutral-300 dark:border-neutral-700 text-foreground hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50";
    case "ghost":
      return "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800";
    case "primary":
    default:
      return "bg-primary text-primary-foreground hover:opacity-90";
  }
}

function sizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-9 px-3 text-sm";
    case "lg":
      return "h-12 px-6 text-base";
    case "md":
    default:
      return "h-10 px-4 text-sm";
  }
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] disabled:opacity-50 disabled:pointer-events-none",
        variantClasses(variant),
        sizeClasses(size),
        className
      )}
      {...props}
    />
  );
}

export default Button;


