import React, {useState} from "react";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Labels, LabelSelector } from "@/components"
import { type RouterOutputs } from "@/utils/api";

type TaskPopover = RouterOutputs["task"]["getAll"][0]

export const TaskPopover = ({task, children} : {task: TaskPopover, children: React.ReactNode}) => {

  const [name, setName] = useState(String(task.name))
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent position="right" size="lg">
        <div className="mt-6 space-y-6">
          <input
            className="text-3xl font-bold text-foreground ring-0 outline-0"
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Untitled"
          />
          <div className="grid grid-cols-[20%_80%] gap-3 items-center">
            <span>Assignees</span>
            <div className="flex">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/reazn.png"/>
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <span>REAZN</span>
            </div>
            <span>Labels</span>
            <div>
              <LabelSelector task={task} showEmpty/>
            </div>
            <span >Due date</span>
            <span >19 Jul 2023</span>
            <span >Created by</span>
            <span >Lewis</span>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}