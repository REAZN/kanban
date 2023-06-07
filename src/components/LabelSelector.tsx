import { Labels } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandGroup,
} from "@/components/ui/command";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import {Command as CommandPrimitive, useCommandState} from "cmdk-root/cmdk/dist"
import {api, type RouterOutputs} from "@/utils/api";
import { useRouter } from "next/router";
import {type KeyboardEvent, useEffect, useState} from "react";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";

type Label = RouterOutputs["label"]["getAll"][0]
type Task = RouterOutputs["task"]["getAll"][0]

const RANDOM_COLOR = Math.floor(Math.random() * 300)


// Todo get selected board from state

const SearchResult = ({boardId, task}: { boardId: string, task: Task }) => {
  const search = useCommandState((state) => state.search)
  // const isEmpty  = useCommandState((state) => state.filtered.count === 0)
  const ctx = api.useContext()
  
  const assignLabel = api.task.assignLabel.useMutation();

  const createLabel = api.label.create.useMutation({
    
    onSuccess: () => {
      // void ctx.label.getAll.invalidate()
    },
  });

  return search ? (
    <>
      <div className="-mx-1 h-px bg-border"></div>
      <CommandGroup className="m-1" forceMount>
        <CommandPrimitive.Item
          forceMount defaultValue={`SEARCH-${search}`} value={`SEARCH-${search}`}
          className=" text-sm pl-1 rounded-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <div className="flex items-center gap-1.5 py-1 cursor-pointer" onClick={() => {
            createLabel.mutate({
              boardId: boardId,
              name: search,
              color: String(RANDOM_COLOR)
            })
          }}>
            Create
            <Labels color={RANDOM_COLOR}>{search}</Labels>
          </div>
        </CommandPrimitive.Item>
      </CommandGroup>
    </>
  ) : null
};


export const LabelSelector = ({task, showEmpty = false}: {task: Task, showEmpty?: boolean}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false)

  const { data: labels, refetch: refetchLabels } = api.label.getAll.useQuery({
    boardId: String(router.query.board),
  });

  const assignLabel = api.task.assignLabel.useMutation({
    onSuccess: () => {
      // TODO change
      // void refetchLabels();
      console.log("assignLabel success", assignLabel?.data)
      },
  });

  const removeLabel = api.task.removeLabel.useMutation({
    onSuccess: () => {
      // TODO change
      void refetchLabels();
    }
  });

  const selectOrCreateLabel = (e: KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    if (e.code === "Enter") {
      console.log("sniff", e)
    }
  }

  const selectLabel = (label: Label): void => {
    console.log("label: ", label)
    assignLabel.mutate({
      id: task.id,
      labelId: label.id
    })
  }

  return (
    <Popover open={open} onOpenChange={(val) => setOpen(val)}>
      <PopoverTrigger asChild onClick={e => e.stopPropagation()}>
        {/*Active*/}
        {task.label.length !== 0 ? (
          <div className="flex gap-1.5 flex-wrap z-1000 cursor-pointer hover:bg-accent p-1 w-fit rounded">

            {task.label.map((activeLabel) => (
            <Labels className="text-xs leading-[170%]" key={activeLabel.id} color={Number(activeLabel.color)}>
              {activeLabel.name}
            </Labels>
          ))}
          </div>

        ) : (
          showEmpty && (
            <div className="flex gap-1.5 flex-wrap z-1000 cursor-pointer hover:bg-accent p-1 w-full rounded">
              <span className="opacity-50">Empty</span>
            </div>
          )
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[270px] p-0" align="start" sideOffset={-30} alignOffset={-15} onClick={e => e.stopPropagation()}>
        <Command onKeyDown={(e) => {
          if (e.code === "Enter") {

          }
        }}>
          <div className="flex flex-wrap w-full gap-1.5 p-2 border-b border-accent-2 items-center bg-accent">
            {/*Active in popover*/}
            {task.label.map((activeLabel) => (
              <Labels className="" key={activeLabel.id} color={Number(activeLabel.color)} deletable
                onClick={() => {
                  removeLabel.mutate({
                    id: task.id,
                    labelId: activeLabel.id
                  })}
                }>
                {activeLabel.name}
              </Labels>
            ))}
            <div className="flex flex-1 w-auto min-w-[70px] pl-1">
              <CommandPrimitive.Input
                className="block text-sm focus:outline-none focus:border-accent-3 w-full bg-transparent"
                placeholder="Search"
                // onKeyUp={(e): void => selectOrCreateLabel(e)}
              />
            </div>
          </div>
          <CommandGroup heading="Select or create a label" className="m-1">
            {/*All board labels*/}
            {labels?.map((label) => (
              <CommandPrimitive.Item defaultValue={label.name}
                key={label.id}
                className="rounded-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <div
                  className="group flex items-center justify-between gap-1.5 p-1.5 py-1 hover:bg-accent cursor-pointer rounded"
                  onClick={(currentValue) => {
                    selectLabel(label)
                    setOpen(false)
                  }}
                >
                  <Labels key={label.id} color={Number(label.color)} >{label.name}</Labels>
                  <div className="hidden group-hover:block rounded hover:bg-white">
                    <MoreHorizontal className="w-5 h-5 opacity-50 shrink-0"/>
                  </div>
                </div>
                </CommandPrimitive.Item>
              ))}
          </CommandGroup>
          {/*TODO temp, make board state*/}
          <SearchResult boardId={task.boardId} task={task}/>
        </Command>
      </PopoverContent>
    </Popover>
  )
}