import { cva } from "class-variance-authority";
import { Toaster as RToaster } from "react-hot-toast";
import { XIcon, CheckIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
const toastVariants = cva(
  "flex items-center gap-2 px-2 py-2 rounded text-sm shadow max-w-sm",
  {
    variants: {
      variant: {
        blank: "",
        error: "bg-destructive text-destructive-foreground",
        success: "bg-green-100 text-green-800",
        loading: "",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "blank",
    },
  }
);

export const Toaster = () => {
  return (
    <RToaster position="bottom-right">
      {(toast): JSX.Element => (
        <div className={cn(toastVariants({ variant: toast.type ?? "blank" }))}>
          {toast.type === "error" && (
            <XIcon className="w-5 h-5 min-w-[1.25rem]" />
          )}
          {toast.type === "success" && <CheckIcon className="w-5 h-5" />}
          {toast.type === "loading" && (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          )}
          <p>{toast.message?.toString()}</p>
        </div>
      )}
    </RToaster>
  );
};
