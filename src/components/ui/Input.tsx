/**
 * Input component - accessible form input
 */

import * as React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {props.required && <span className="text-danger-600">*</span>}
        </label>
      )}
      <input
        className={clsx(
          "w-full px-4 py-2.5 text-base border-2 rounded-lg",
          "bg-white dark:bg-neutral-800",
          "text-neutral-900 dark:text-white",
          "border-neutral-200 dark:border-neutral-700",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed",
          "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
          "transition-colors duration-200",
          error && "border-danger-500 focus:ring-danger-500",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  ),
);

Input.displayName = "Input";

export { Input };
