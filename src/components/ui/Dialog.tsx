/**
 * Dialog/Modal component using Radix UI
 */

import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, children }, ref) => (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  ),
);

Dialog.displayName = "Dialog";

const DialogTrigger = RadixDialog.Trigger;

const DialogPortal = RadixDialog.Portal;

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, showClose = true, ...props }, ref) => (
    <DialogPortal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-40" />
      <RadixDialog.Content
        ref={ref}
        className={clsx(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "border-2 border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-800",
          "rounded-lg shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className,
        )}
        {...props}
      >
        {props.children}
        {showClose && (
          <RadixDialog.Close className="absolute right-4 top-4 rounded-md opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-primary-500 dark:data-[state=open]:bg-neutral-800">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </DialogPortal>
  ),
);

DialogContent.displayName = "DialogContent";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      className={clsx(
        "flex flex-col space-y-1.5 p-6 border-b border-neutral-200 dark:border-neutral-700",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={clsx(
      "text-lg font-semibold leading-none tracking-tight",
      "text-neutral-900 dark:text-white",
      className,
    )}
    {...props}
  />
));

DialogTitle.displayName = "DialogTitle";

interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div className={clsx("px-6 py-4", className)} ref={ref} {...props} />
  ),
);

DialogBody.displayName = "DialogBody";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      className={clsx(
        "flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
};
