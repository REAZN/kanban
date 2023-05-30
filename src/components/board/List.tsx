import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Plus } from "lucide-react"
import { api, type RouterOutputs } from "@/utils/api";
import { TaskPopover, Task } from "@/components";
import { useRouter } from "next/router";

type List = RouterOutputs["list"]["getAll"][0];

export const List = ({list, index}: {list: List, index: number }) => {

  const router = useRouter();

  const { data: tasks, refetch: refetchTasks } = api.task.getAll.useQuery({
    boardId: String(router.query.board),
  });

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Droppable droppableId={String(index)} type="task">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="w-64">
                <div className={`relative flex w-full flex-col overflow-hidden ${snapshot.isDraggingOver ? "bg-green-100" : ""}`}>
                  <h3 className="mb-2 text-2xl text-gray-600">
                    {list.name}
                  </h3>
                  <div className="h-auto overflow-y-auto overflow-x-hidden flex flex-col gap-2"
                       // style={{ maxHeight: "calc(100vh - 290px)"}}
                  >
                    {tasks?.map((task, index) => {
                      if (task.listId !== list.id) return null;
                      return (
                        // <TaskPopover task={task} key={index}>
                          <Task
                            key={index}
                            className="last:mb-1"
                            index={index}
                            task={task}
                          />
                        // </TaskPopover>
                      )
                    })}
                  </div>
                  <button
                    className="w-full text-sm flex gap-2 mt-1 hover:bg-accent flex items-center justify-left pl-1 py-1.5 rounded-md"
                    onClick={() =>
                      createTask.mutate({
                        boardId: String(router.query.board),
                        listId: list.id,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 shrink-0 opacity-50"/>
                    <span className="opacity-50">New</span>
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}