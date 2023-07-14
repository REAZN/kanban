import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { boardRouter } from "@/server/api/routers/board";
import { listRouter } from "@/server/api/routers/list";
import { taskRouter } from "@/server/api/routers/task";
import { labelRouter } from "@/server/api/routers/label";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  board: boardRouter,
  list: listRouter,
  task: taskRouter,
  label: labelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
