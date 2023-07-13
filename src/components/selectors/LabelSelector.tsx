import { Labels } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup } from "@/components/ui/command";

import {
  Command as CommandPrimitive,
  useCommandState,
} from "cmdk-root/cmdk/dist";
import { api, type RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Label = RouterOutputs["label"]["getAll"][0];
type Task = RouterOutputs["task"]["getAll"][0];

const RANDOM_COLOR = Math.floor(Math.random() * 300);

const SearchResult = ({
  boardId,
  task,
  addLabel,
}: {
  boardId: string;
  task: Task;
  addLabel: (label: Label) => void;
}) => {
  const search = useCommandState((state) => state.search);

  const assignLabel = api.task.assignLabel.useMutation();

  const createLabel = api.label.create.useMutation({
    onSuccess: (callback) => {
      assignLabel.mutate({
        id: task.id,
        labelId: callback.id,
      });
    },

    onMutate: (newLabel) => {
      addLabel({
        ...newLabel,
        id: "temp",
        taskId: task.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  });

  return search ? (
    <>
      <div className="-mx-1 h-px bg-border"></div>
      <CommandGroup className="m-1" forceMount>
        <CommandPrimitive.Item
          defaultValue={`SEARCH-${search}`}
          value={`SEARCH-${search}`}
          className="rounded-sm pl-1 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <div
            className="flex cursor-pointer items-center gap-1.5 py-1"
            onClick={() => {
              createLabel.mutate({
                boardId: boardId,
                name: search,
                color: String(RANDOM_COLOR),
              });
            }}
          >
            Create
            <Labels color={RANDOM_COLOR}>{search}</Labels>
          </div>
        </CommandPrimitive.Item>
      </CommandGroup>
    </>
  ) : null;
};

export const LabelSelector = ({
  task,
  showEmpty = false,
  small = true,
  className,
  refresh,
}: {
  task: Task;
  showEmpty?: boolean;
  small?: boolean;
  className?: string;
  refresh: () => unknown;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [taskS, setTaskS] = useState<Task>(task);

  useEffect(() => {
    setTaskS(task);
  }, [task]);

  const { data: labels } = api.label.getAll.useQuery({
    boardId: String(router.query.board),
  });

  const assignLabel = api.task.assignLabel.useMutation({
    onSuccess: () => {
      void refresh();
      console.log("assignLabel success", assignLabel?.data);
    },
  });

  const removeLabel = api.task.removeLabel.useMutation({
    onSuccess: () => {
      void refresh();
    },
  });

  const addLabel = (label: Label): void => {
    if (taskS.label.find((lbl) => lbl.id === label.id)) return;
    setTaskS({
      ...taskS,
      label: [...taskS.label, label],
    });
  };

  const deleteLabel = (label: Label): void => {
    setTaskS({
      ...taskS,
      label: taskS.label.filter((lbl) => lbl.id !== label.id),
    });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          input.value === ""
        ) {
          // TODO remote label
          console.log("empty, remove last label");
          // removeLabel.mutate({
          //   id: taskS.id,
          //   labelId:
          // })
        }
      }
    },
    []
  );

  return (
    <Popover open={open} onOpenChange={(val) => setOpen(val)}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {/*Active*/}
        {taskS.label.length !== 0 ? (
          <div
            className={cn(
              "z-1000 flex w-fit cursor-pointer flex-wrap gap-1.5 rounded p-1 hover:bg-accent",
              className
            )}
          >
            {taskS.label.map((activeLabel) => (
              <Labels
                className={`${small ? "text-xs" : "text-sm"} leading-[160%]`}
                key={activeLabel.id}
                color={Number(activeLabel.color)}
              >
                {activeLabel.name}
              </Labels>
            ))}
          </div>
        ) : (
          showEmpty && (
            <div className="z-1000 flex w-full cursor-pointer flex-wrap gap-1.5 rounded p-1 hover:bg-accent">
              <span className="opacity-50">Empty</span>
            </div>
          )
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[270px] p-0"
        align="start"
        sideOffset={-30}
        alignOffset={-15}
        onClick={(e) => e.stopPropagation()}
      >
        <Command onKeyDown={handleKeyDown}>
          {/*//   onKeyDown={(e) => {*/}
          {/*//   if (e.code === "Enter") {*/}
          {/*//*/}
          {/*//   }*/}
          {/*// }}*/}
          {/*// >*/}
          <div className="border-accent-2 flex w-full flex-wrap items-center gap-1.5 border-b bg-accent p-2">
            {/*Active in popover*/}
            {taskS.label.map((activeLabel) => (
              <Labels
                className=""
                key={activeLabel.id}
                color={Number(activeLabel.color)}
                deletable
                onClick={() => {
                  deleteLabel(activeLabel);
                  removeLabel.mutate({
                    id: taskS.id,
                    labelId: activeLabel.id,
                  });
                }}
              >
                {activeLabel.name}
              </Labels>
            ))}
            <div className="flex w-auto min-w-[70px] flex-1 pl-1">
              <CommandPrimitive.Input
                className="focus:border-accent-3 block w-full bg-transparent text-sm focus:outline-none"
                placeholder="Search"
                ref={inputRef}
                value={input}
                onValueChange={setInput}
                // onKeyUp={(e): void => selectOrCreateLabel(e)}
              />
            </div>
          </div>
          <CommandGroup heading="Select or create a label" className="m-1">
            {/*All board labels*/}
            {labels?.map((label) => (
              <CommandPrimitive.Item
                defaultValue={label.name}
                key={label.id}
                className="rounded-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <div
                  className="group flex cursor-pointer items-center justify-between gap-1.5 rounded p-1.5 py-1 hover:bg-accent"
                  onClick={() => {
                    addLabel(label);
                    assignLabel.mutate({
                      id: taskS.id,
                      labelId: label.id,
                    });
                    // setOpen(false)
                  }}
                >
                  <Labels key={label.id} color={Number(label.color)}>
                    {label.name}
                  </Labels>
                  <div className="hidden rounded hover:bg-white group-hover:block">
                    <MoreHorizontal className="h-5 w-5 shrink-0 opacity-50" />
                  </div>
                </div>
              </CommandPrimitive.Item>
            ))}
          </CommandGroup>
          {/*TODO temp, make board state*/}
          <SearchResult
            boardId={task.boardId}
            task={task}
            addLabel={addLabel}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
};
