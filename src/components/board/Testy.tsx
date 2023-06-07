"use client"
import {
  Sheet,
  SheetClose,
  SheetContent, SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const Testy = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button>Open</button>
        </SheetTrigger>
        <SheetContent position="right" size="lg">
          <Popover>
            <PopoverTrigger asChild>
              <button>Open</button>
            </PopoverTrigger>
            <PopoverContent>
              hi
            </PopoverContent>
          </Popover>
          hi
        </SheetContent>
      </Sheet>
    </div>
  )
}