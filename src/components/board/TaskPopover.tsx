import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Labels, LabelSelector } from "@/components";
import { type RouterOutputs } from "@/utils/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TaskPopover = RouterOutputs["task"]["getAll"][0];

export const TaskPopover = ({
  task,
  children,
  refresh,
}: {
  task: TaskPopover;
  children: React.ReactNode;
  refresh: () => unknown;
}) => {
  const [name, setName] = useState(String(task.name));
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent position="right" size="lg" className="p-0">
        <div className="mt-6 space-y-6">
          <div className="p-6 pb-0">
            <input
              className="text-4xl font-bold text-foreground outline-0 ring-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled"
            />
            {/* TODO - force min-height on everything */}
            <div className="mt-2 box-border grid w-full grid-cols-[25fr,75fr] items-center gap-3 border-t pt-4">
              <span className="text-muted-foreground">Assignees</span>
              <div className="flex space-x-2 rounded hover:bg-muted">
                <div className="flex items-center space-x-2 rounded py-1 pl-1 pr-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="https://cdn.discordapp.com/avatars/165514073776062464/d3f75506c2ba61dac04770eb5abeb000.png" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <span className="select-none text-sm font-medium">REAZN</span>
                </div>
              </div>
              <span className="text-muted-foreground">Labels</span>
              <div>
                <LabelSelector
                  task={task}
                  refresh={refresh}
                  small={false}
                  showEmpty
                  className="w-full"
                />
              </div>
              <span className="text-muted-foreground">Due date</span>
              <div className="flex space-x-2 rounded hover:bg-muted">
                <span className="select-none text-sm font-medium">REAZN</span>
              </div>
              <span className="text-muted-foreground">Created by</span>
              <div className="flex space-x-2 rounded hover:bg-muted">
                <div className="flex items-center space-x-2 rounded py-1 pl-1 pr-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="https://cdn.discordapp.com/avatars/165514073776062464/d3f75506c2ba61dac04770eb5abeb000.png" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <span className="select-none text-sm font-medium">REAZN</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="pl-5">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="description" className="mt-0">
                <textarea
                  className="h-24 w-full rounded-lg bg-muted/50 p-3"
                  placeholder="Add a more detailed description..."
                />
              </TabsContent>
              <TabsContent value="comments">comments...</TabsContent>
            </div>
          </Tabs>
          <SheetFooter className="p-6 pt-0">
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
