import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const listRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      withTasks: z.boolean().optional().default(false)
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.list.findMany({
        where: {
          boardId: input.boardId,
        },
        include: {
          task: input.withTasks ? {
            include: {
              label: true,
            }
          } : false,
        }
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
    ),

  updatePos: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      listId: z.string(),
      newPosition: z.number()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        await tx.list.updateMany({
          where: {
            boardId: input.boardId,
            position: {
              gte: input.newPosition
            }
          },
          data: {
            position: {
              increment: 1
            }
          }
        })

        const list = await tx.list.findUnique({
          where: {
            id: input.listId,
          }
        })

        await tx.list.update({
          where: {
            id: input.listId,
          },
          data: {
            position: input.newPosition,
          }
        })

        if (list?.position) {
          await tx.list.updateMany({
            where: {
              boardId: input.boardId,
              position: {
                gte: list.position 
              }
            },
            data: {
              position: {
                decrement: 1
              }
            }
          })
        }
      });
    }
  )
})