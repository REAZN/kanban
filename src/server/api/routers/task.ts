import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      listId: z.string().optional()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          boardId: input.boardId,
          listId: input.listId,
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
    }),

  assignLabel: protectedProcedure
    .input(z.object({
      id: z.string(),
      labelId: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          label: {
            connect: {
              id: input.labelId,
            }
          }
        }
      });
    }),

  removeLabel: protectedProcedure
    .input(z.object({
      id: z.string(),
      labelId: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          label: {
            disconnect: {
              id: input.labelId,
            }
          }
        }
      });
    })
})
