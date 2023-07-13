import { create } from "zustand"
import { devtools } from "zustand/middleware"
import {type RouterOutputs} from "@/utils/api";

type List = RouterOutputs["list"]["getAll"][0];
type Label = RouterOutputs["label"]["getAll"][0];


interface Store {
  lists: List[]
  updateList: (list: List) => void
  updateListPos: (id: string, fromPos: number, toPos: number) => void
  addList: (list: List) => void
  setLists: (lists: List[]) => void
}

export const useBoardStore = create<Store>()(devtools((set) => ({
  lists: [],
  updateList: (list: List) => set((state) => ({
    lists: state.lists.map((sList) => {
      if (sList.id === list.id) {
        // TODO Position too?
        return {...sList, name: list.name}
      }
      return sList;
    })
  })),
  updateListPos: (id, fromPos, toPos) => set((state) => {
    const newArr = [...state.lists];
    // const temp = newArr[fromPos];
    // newArr[fromPos] = newArr[toPos];
    // newArr[toPos] = temp;
    newArr.splice(toPos, 0, newArr.splice(fromPos, 1)[0]);
    console.log("new Arr", newArr)
    return {lists: newArr};
  }),
  setLists: (lists: List[]) => set(() => ({ lists })),
  addList: (list: List) => set((state) => ({ lists: [...state.lists, list] })),

})))
