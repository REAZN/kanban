import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react"

/**
 * hsla color format
 */
export const Labels = ({ children, className, color = 40, deletable = false, onClick, ...props }: {
  children: React.ReactNode,
  className?: string,
  color: number,
  deletable?: boolean,
  onClick?: () => void
}) => {
  return (
    <div
      className={cn( `flex items-center justify-between w-fit font-medium h-fit text-sm leading-[90%] text-ellipsis rounded-[3px] leading-1 whitespace-nowrap ${deletable ? "pl-1.5" : "px-1.5"}`, className)}
      style={{ color: `hsla(${color}, 50%, 30%, 1)`, backgroundColor: `hsla(${color}, 60%, 80%, 1)`}}
      {...props}
    >
      {children}
      {deletable && (
        <X className="box-content cursor-pointer w-3.5 h-3.5 px-1.5" onClick={onClick}/>
      )}
    </div>
  );
}