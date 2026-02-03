/**
 * Card component - container for content
 */

import * as React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  borderRadius?: "sm" | "md" | "lg" | "xl";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, borderRadius = "lg", ...props }, ref) => (
    <div
      className={clsx(
        "bg-white dark:bg-neutral-800",
        "border-2 border-neutral-200 dark:border-neutral-700",
        "shadow-sm dark:shadow-md",
        "transition-all duration-200",
        hoverable &&
          "hover:shadow-md dark:hover:shadow-lg hover:-translate-y-0.5",
        {
          "rounded-sm": borderRadius === "sm",
          "rounded-md": borderRadius === "md",
          "rounded-lg": borderRadius === "lg",
          "rounded-xl": borderRadius === "xl",
        },
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      className={clsx(
        "px-6 py-4 border-b border-neutral-200 dark:border-neutral-700",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div className={clsx("p-6", className)} ref={ref} {...props} />
  ),
);

CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      className={clsx(
        "px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-end gap-2",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
