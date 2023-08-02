import { CommandIcon } from "lucide-react";

export const Kbd = ({ children }: { children: React.ReactNode }) => {
  const isMac = navigator.userAgent.search("Mac") != -1;

  return (
    <kbd className="bg-gray-200 rounded-md px-2 py-1 text-sm font-semibold">
      {isMac ? (
        <CommandIcon className="w-5 h-5" />
      ) : (
        <span className="text-xs">Ctrl</span>
      )}
      <span>{children}</span>
    </kbd>
  );
};
