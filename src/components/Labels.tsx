import React from "react";
import { cn } from "@/lib/utils";

/**
 * hsla color format
 */
export const Labels = ({ children, className, color = 40, ...props }: {
    children: React.ReactNode,
    className?: string,
    color: number
  }) => {
  return (
    <div className={cn( "font-medium text-xs px-1.5 py-0.5 rounded leading-1 whitespace-nowrap", className)} {...props}
      style={{ color: `hsla(${color}, 50%, 30%, 1)`, backgroundColor: `hsla(${color}, 60%, 80%, 1)`}}
    >
      {children}
    </div>
  );
}