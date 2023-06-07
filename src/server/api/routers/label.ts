import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const labelRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      boardId: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.label.findMany({
        where: {
          boardId: input.boardId,
        },
         orderBy: {
          createdAt: "asc",
         }
      });
    }),

  create: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      name: z.string(),
      color: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.create({
        data: {
          boardId: input.boardId,
          name: input.name,
          color: input.color,
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      color: z.string().optional()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.label.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color,
        }
      });
    })
})