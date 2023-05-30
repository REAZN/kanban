import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      boardId: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          boardId: input.boardId,
        },
        include: {
          label: true,
        }
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      listId: z.string(),
      boardId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          listId: input.listId,
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      listId: z.string().optional(),
      position: z.number().optional()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          listId: input.listId,
          position: input.position,
        }
      });
    })
})
