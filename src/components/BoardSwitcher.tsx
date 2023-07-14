import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { api, type RouterOutputs } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn, stringToHslColor } from "@/lib/utils";
import { useSettingsStore } from "@/store";
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
  const router = useRouter();
  const { selectedBoard, setSelectedBoard } = useSettingsStore();

  const [open, setOpen] = useState(false);

  const {
    data: boards,
    refetch: refetchBoards,
    isLoading,
  } = api.board.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    // select: (data) => {
    //   console.log("select ran", data);
    // }
  });

  // const [selectedBoard, setSelectedBoard] = useState<Board | undefined>();

  useEffect(() => {
    setSelectedBoard(
      boards?.find((board) => board.id === router.query.board) ?? selectedBoard
    );
  }, [boards, router.query.board, setSelectedBoard, selectedBoard]);

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
              <AvatarImage src={``} alt={selectedBoard?.name} />
            )}
            <AvatarFallback>
              {isLoading ? (
                <Skeleton />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(-45deg, ${stringToHslColor(
                      String(selectedBoard?.name)
                    )} 25%, ${stringToHslColor(
                      String(selectedBoard?.name) + "yeet"
                    )} 75%)`,
                  }}
                />
              )}
            </AvatarFallback>
          </Avatar>

          {isLoading ? (
            <Skeleton className="h-1/2 w-1/2 rounded-full" />
          ) : (
            selectedBoard?.name
          )}
          <ChevronsUpDown className="ml-3 ml-auto h-4 w-4 shrink-0 opacity-50" />
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
                <Link href={`/board/${board.id}`} key={board.id}>
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
                              String(board.name)
                            )} 25%, ${stringToHslColor(
                              String(board.name) + "yeet"
                            )} 75%)`,
                          }}
                          className={"h-full w-full"}
                        />
                      </AvatarFallback>
                    </Avatar>
                    {board.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBoard?.id === board.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            {/*))}*/}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  createBoard.mutate({
                    name: `${
                      sessionData?.user?.name
                        ? `${sessionData?.user?.name}'s`
                        : "New"
                    } Board`,
                  });
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                New Board
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
