import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * hsla color format
 */
export const Labels = ({
  children,
  className,
  color = 40,
  deletable = false,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  color: number;
  deletable?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        `leading-1 flex h-fit w-fit items-center justify-between text-ellipsis whitespace-nowrap rounded-[3px] text-sm font-medium leading-[160%] ${
          deletable ? "pl-1.5" : "px-1.5"
        }`,
        className
      )}
      style={{
        color: `hsla(${color}, 50%, 30%, 1)`,
        backgroundColor: `hsla(${color}, 60%, 80%, 1)`,
      }}
      {...props}
    >
      {children}
      {deletable && (
        <X
          className="box-content h-3.5 w-3.5 cursor-pointer px-1.5"
          onClick={onClick}
        />
      )}
    </div>
  );
};
