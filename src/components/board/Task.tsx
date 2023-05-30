import { Draggable } from "react-beautiful-dnd";
import { type RouterOutputs } from "@/utils/api";
import { cn } from "@/lib/utils";
import { LabelSelector } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Task = RouterOutputs["task"]["getAll"][0]

export const Task = ({task, index, className, ...props}: { task: Task, index: number, className: string}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={cn("rounded-md border bg-card text-card-foreground py-2 shadow px-2", className)}
          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} {...props}>

          {task.name ? (
            <p className="text-black/70 font-medium leading-5">{task.name}</p>
          ) : (
            <p className="text-muted-foreground/70 font-medium">Untitled</p>
          )}
          <LabelSelector activeLabels={task.label}/>

          <div>
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://github.com/reazn.png" alt="avatar" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
    </Draggable>
  )
}