"use client";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { Plus } from "lucide-react";
import { api, type RouterOutputs } from "@/utils/api";
import { TaskPopover, Task as TaskComp } from "@/components";
import { useRouter } from "next/router";
import { useBoardStore } from "@/store";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { CornerDownLeft } from "lucide-react";
import { useState } from "react";

type List = RouterOutputs["list"]["getAll"][0];
type Task = RouterOutputs["task"]["getAll"][0];

export const List = ({
  list,
  index,
  className,
  refresh,
}: {
  list: List;
  index: number;
  className: string;
  refresh: () => unknown;
}) => {
  const router = useRouter();
  const listState = useBoardStore();
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(list.name);

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      void refresh();
    },
  });

  const updateName = api.list.updateName.useMutation({
    onSuccess: () => {
      void refresh();
    },
  });

  // Calls twice due to onBlur
  const handleNameChange = (): void => {
    (document.activeElement as HTMLElement).blur();
    updateName.mutate({
      listId: list.id,
      name,
    });
    listState.updateList({
      ...list,
      name,
    });
    setOpen(false);
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={className}
        >
          <Droppable droppableId={String(index)} type="task">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-64"
              >
                <div
                  className={`relative flex w-full flex-col overflow-hidden ${
                    snapshot.isDraggingOver ? "bg-green-100" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Popover open={open} onOpenChange={() => setOpen(!open)}>
                      <PopoverTrigger asChild>
                        <div className="hover:bg-accent rounded-md p-1 max-w-[12rem]">
                          {list.name ? (
                            <p className="h-5 relative text-lg font-medium leading-5 text-foreground whitespace-nowrap w-full overflow-hidden text-ellipsis">
                              {list.name}
                            </p>
                          ) : (
                            <p className="text-lg font-medium leading-5 text-muted-foreground/70">
                              Untitled
                            </p>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-2 bg-muted"
                        onBlur={() => handleNameChange()}
                      >
                        <form
                          className="flex items-center gap-1"
                          onSubmit={(e) => {
                            handleNameChange();
                            e.preventDefault();
                          }}
                        >
                          <input
                            className="text-lg text-gray-900 w-full focus:outline-none bg-transparent"
                            defaultValue={list.name}
                            placeholder="Untitled"
                            autoFocus
                            onFocus={(e) =>
                              e.target.setSelectionRange(
                                e.target.value.length,
                                e.target.value.length
                              )
                            }
                            onChange={(e) => setName(e.target.value)}
                          />
                          <Button size="sm" className="flex gap-2">
                            <span>Done</span>
                            <CornerDownLeft className="h-4 w-4" />
                          </Button>
                        </form>
                      </PopoverContent>
                    </Popover>
                    <div className="opacity-50 ml-2">{list.task?.length}</div>
                    <button
                      className="ml-auto p-1.5 items-center gap-2 rounded-md text-sm hover:bg-accent"
                      onClick={() =>
                        createTask.mutate({
                          boardId: String(router.query.board),
                          listId: list.id,
                        })
                      }
                    >
                      <Plus className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                    <div></div>
                  </div>
                  <div
                    className="flex h-auto flex-col overflow-y-auto overflow-x-hidden"
                    // style={{ maxHeight: "calc(100vh - 290px)"}}
                  >
                    {list?.task?.map((task, indexT: number) => {
                      // if (task.listId !== list.id) return null;
                      return (
                        // <TaskPopover task={task} key={indexT}>
                        <TaskComp
                          key={indexT}
                          className="my-1 last:mb-1"
                          index={indexT}
                          task={task as Task}
                          refresh={refresh}
                        />
                        // </TaskPopover>
                      );
                    })}
                  </div>
                  <button
                    className="justify-left mt-1 flex w-full items-center gap-2 rounded-md py-1.5 pl-1 text-sm hover:bg-accent"
                    onClick={() =>
                      createTask.mutate({
                        boardId: String(router.query.board),
                        listId: list.id,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 shrink-0 opacity-50" />
                    <span className="opacity-50">New</span>
                  </button>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
