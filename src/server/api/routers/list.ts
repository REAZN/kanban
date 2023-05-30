import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const listRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      boardId: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.list.findMany({
        where: {
          boardId: input.boardId,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      boardId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.list.create({
        data: {
          name: input.name,
          boardId: input.boardId,
        }
      });
      }
    )
})