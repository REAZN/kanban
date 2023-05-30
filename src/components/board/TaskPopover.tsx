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
import { Labels } from "@/components"
import { type RouterOutputs } from "@/utils/api";

type TaskPopover = RouterOutputs["task"]["getAll"][0]

export const TaskPopover = ({task, children} : {task: TaskPopover, children: React.ReactNode}) => {

  const [name, setName] = useState(String(task.name))

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent position="right" size="lg">
        <div className="mt-6 space-y-6">
          <input
            className="text-3xl font-bold text-foreground ring-0 outline-0"
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Untitled"
          />
          <div className="grid grid-cols-[20%_80%] gap-3">
            <span>Assignees</span>
            <div className="flex">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/reazn.png"/>
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <span>REAZN</span>
            </div>
            <span>Labels</span>
            <div className="flex items-center">
              <div className="flex gap-1 flex-wrap mt-2">
                <Labels color={200}>Test</Labels>
                <Labels color={20}>dhdhd</Labels>
                <Labels color={90}>Hehe</Labels>
                <Labels color={300}>Hello</Labels>
              </div>
            </div>
              <span>Due Date</span>
              <span>19 Jul 2023</span>
              <span>Created by</span>
              <span>Lewis</span>
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