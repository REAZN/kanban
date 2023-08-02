import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { api, type RouterOutputs } from "@/lib/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn, stringToHslColor } from "@/lib/utils";
import { useBoardStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Board = RouterOutputs["board"]["getAll"][0];

export const BoardSwitcher = () => {
  const { data: sessionData } = useSession();
  const { board, user } = useBoardStore();

  const [open, setOpen] = useState(false);

  const {
    data: boards,
    refetch: refetchBoards,
    isLoading,
  } = api.board.getAll.useQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user?.id,
    }
  );

  const createBoard = api.board.create.useMutation({
    onSuccess: () => {
      void refetchBoards();
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="justify-between px-0"
          variant="ghost"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a board"
        >
          <Avatar className="mr-2 h-5 w-5">
            {isLoading ? (
              <Skeleton className="rounded-full" />
            ) : (
              <AvatarImage src={``} alt={board?.name} />
            )}
            <AvatarFallback>
              {isLoading ? (
                <Skeleton />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(-45deg, ${stringToHslColor(
                      String(board?.id)
                    )} 25%, ${stringToHslColor(
                      String(board?.id) + "yeet"
                    )} 75%)`,
                  }}
                />
              )}
            </AvatarFallback>
          </Avatar>

          {isLoading ? (
            <Skeleton className="h-1/2 w-1/2 rounded-full" />
          ) : (
            board?.name
          )}
          <ChevronsUpDownIcon className="ml-3 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search boards..." />
            <CommandEmpty>No board found.</CommandEmpty>
            <CommandGroup heading="Personal">
              {isLoading && <div>Loading...</div>}
              {boards?.map((board, index) => (
                <Link
                  href={`/${board.owner?.username ?? "bozo"}/${board.slug}`}
                  key={board.id}
                >
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={``} alt={board.name} />
                      <AvatarFallback>
                        <div
                          style={{
                            background: `linear-gradient(-45deg, ${stringToHslColor(
                              String(board.id)
                            )} 20%, ${stringToHslColor(
                              String(board.id) + "yeet"
                            )} 80%)`,
                          }}
                          className={"h-full w-full"}
                        />
                      </AvatarFallback>
                    </Avatar>
                    {board.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        board?.id === board.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // TODO change slug gen
                  createBoard.mutate({
                    name: `${
                      sessionData?.user?.name
                        ? `${sessionData?.user?.name}'s`
                        : "New"
                    } Board`,
                    slug: `${sessionData?.user?.username ?? "new"}-board`,
                  });
                }}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                New Board
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
