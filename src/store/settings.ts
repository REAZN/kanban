import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { type Theme } from "@/lib/constants";
import { type RouterOutputs } from "@/utils/api";

type Board = RouterOutputs["board"]["getAll"][0];


interface Store {
  theme: Theme
  selectedBoard: Board | undefined,
  setTheme: (theme: Theme) => void
  setSelectedBoard: (board: Board | undefined) => void
}
  
export const useSettingsStore = create<Store>()(
    devtools(
      persist(
        (set) => ({
          selectedBoard: undefined,
          theme: "system",
          setTheme: (theme) => set(() => ({ theme })),
          setSelectedBoard: (board) => set(() => ({ selectedBoard: board }))
        }),{ name: "settings", version: 1 }
      )
    )
  )