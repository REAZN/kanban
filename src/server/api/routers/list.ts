import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
            orderBy: {
              position: "asc"
            },
            include: {
              label: {
                orderBy: {
                  updatedAt: "asc"
                }
              },
            }
          } : false,
        },
        orderBy: {
          position: "asc"
        }
      });
    }),

  create: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      name: z.string().optional()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const highestPosition = (await tx.list.findMany({
          where: {
            boardId: input.boardId,
          },
          orderBy: {
            position: "desc"
          },
          take: 1,
        })).pop()?.position ?? 0;

        await tx.list.create({
          data: {
            boardId: input.boardId,
            name: input.name,
            position: highestPosition + 1,
          }
        })
      });
    }),

  updateName: protectedProcedure
    .input(z.object({
      listId: z.string(),
      name: z.string()
    })).mutation(({ctx, input}) => {
    return ctx.prisma.list.update({
      where: {
        id: input.listId,
      },
      data: {
        name: input.name,
      }
    })
  }),

  updatePos: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      listId: z.string(),
      newPosition: z.number().min(0) 
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {

        const list = await tx.list.findUnique({
          where: {
            id: input.listId,
          }
        })

        if (!list || list.position === null) throw new TRPCError({code: "BAD_REQUEST", message: "List not found"})
        if (input.newPosition === list.position) throw new TRPCError({code: "CONFLICT", message: "Position is the same"})

        const highestPosition = (await tx.list.findMany({
          where: {
            boardId: input.boardId,
          },
          orderBy: {
            position: "desc"
          },
          take: 1,
        })).pop()?.position ?? 0;

        if (input.newPosition > highestPosition) {
          input.newPosition = highestPosition
        }

        if (input.newPosition < 0) throw new TRPCError({code: "BAD_REQUEST", message: "Position cannot be negative"})

        await tx.list.updateMany({
          where: {
            boardId: input.boardId,
            position: {
              [list.position > input.newPosition ? "gte" : "gt"]: input.newPosition,
            }
         },
          data: {
            position: {
              increment: 1
            }
          }
        })

        await tx.list.update({
          where: {
            id: input.listId,
          },
          data: {
            position: list.position > input.newPosition ? input.newPosition : input.newPosition + 1,
          }
        })

        await tx.list.updateMany({
          where: {
            boardId: input.boardId,
            position: {
              gt: list.position
            }
          },
          data: {
            position: {
              decrement: 1
            }
          }
        })
      });
    }
  )
})