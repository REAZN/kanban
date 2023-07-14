"use client";

import { Draggable } from "react-beautiful-dnd";
import { type RouterOutputs } from "@/utils/api";
import { cn } from "@/lib/utils";
import { LabelSelector } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaskPopover } from "@/components";

type Task = RouterOutputs["task"]["getAll"][0];

export const Task = ({
  task,
  index,
  className,
  refresh,
  ...props
}: {
  task: Task;
  index: number;
  className: string;
  refresh: () => void;
}) => {
  // console.log(task.id, "task id")
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <TaskPopover task={task} refresh={refresh}>
          <div
            className={cn(
              "cursor-default space-y-2 rounded-md border bg-card px-2 py-2 text-card-foreground shadow",
              className
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...props}
          >
            {task.name ? (
              <p className="font-medium leading-5 text-foreground">
                {task.name}
              </p>
            ) : (
              <p className="font-medium text-muted-foreground/70">Untitled</p>
            )}
            <LabelSelector task={task} refresh={refresh} />

            {/* <div>
             <Avatar className="h-6 w-6">
               <AvatarImage src="https://github.com/reazn.png" alt="avatar" />
               <AvatarFallback></AvatarFallback>
             </Avatar>
            </div>
             <button className="bg-blue-200">open</button> */}
          </div>
        </TaskPopover>
      )}
    </Draggable>
  );
};
