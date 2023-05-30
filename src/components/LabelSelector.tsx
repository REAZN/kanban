import { Labels } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {api, type RouterOutputs} from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

type Label = RouterOutputs["label"]["getAll"][0]

export const LabelSelector = ({activeLabels}: {activeLabels: Label[]}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const { data: labels, refetch: refetchTasks } = api.label.getAll.useQuery({
    boardId: String(router.query.board),
  });

  const createLabel = api.label.create.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>

        <div className="flex gap-2 flex-wrap mt-2 z-1000 cursor-pointer hover:bg-accent p-1 w-fit rounded">
          <Labels color={200}>Test</Labels>
          {activeLabels.map((activeLabel) => (
            <Labels key={activeLabel.id} color={Number(activeLabel.color)}>{activeLabel.name}</Labels>
          ))}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {/*<Command>*/}
        <div className="m-2">
          {activeLabels.map((activeLabel) => (
            <div key={activeLabel.id}>
              <Labels className=""  color={Number(activeLabel.color)}>{activeLabel.name}</Labels>
            </div>
          ))}
        </div>
        <div className="m-1">
          {labels?.map((label) => (
              <div
                className="group flex items-center justify-between gap-2 p-1.5 hover:bg-accent cursor-pointer rounded"
                key={label.id}
                onSelect={(currentValue) => {
                  // setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Labels key={label.id} color={Number(label.color)}>{label.name}</Labels>
                <div className="hidden group-hover:block rounded hover:bg-white">
                  <MoreHorizontal className="w-5 h-5 opacity-50 shrink-0"/>
                </div>
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}