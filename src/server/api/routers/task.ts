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
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      listId: z.string(),
      boardId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const highestPosition = (await tx.task.findMany({
          where: {
            boardId: input.boardId,
            listId: input.listId,
          },
          orderBy: {
            position: "desc"
          },
          take: 1,
        })).pop()?.position ?? 0;
        await tx.task.create({
          data: {
            boardId: input.boardId,
            listId: input.listId,
            name: input.name,
            position: highestPosition + 1,
          }
        });
      })
    }),

    // TODO remove
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

  updateName: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
    }),

  updatePos: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      listId: z.string(),
      taskId: z.string(),
      newPosition: z.number().min(0),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {

        console.log("is this being called? -------------------------------------------")

        const task = await tx.task.findUnique({
          where: {
            id: input.taskId,
          }
        })

        // TODO throw error
        if (!task || task.position === null) return
        if (input.newPosition === task.position) return

        const highestPosition = (await tx.task.findMany({
          where: {
            boardId: input.boardId,
            listId: input.listId,
          },
          orderBy: {
            position: "desc"
          },
          take: 1,
        })).pop()?.position ?? 0;

        console.log(highestPosition, "hieghtest position -------------------------------------------")

        if (input.newPosition > highestPosition) {
          input.newPosition = highestPosition
        }

        // TODO throw 
        if (input.newPosition < 0) return

        console.log("2222 is this being called? -------------------------------------------")


        await tx.task.updateMany({
          where: {
            boardId: input.boardId,
            listId: input.listId,
            position: {
              [task.position > input.newPosition ? 'gte' : 'gt']: input.newPosition,
            }
         },
          data: {
            position: {
              increment: 1
            }
          }
        })

        await tx.task.update({
          where: {
            id: input.taskId,
          },
          data: {
            position: task.position > input.newPosition ? input.newPosition : input.newPosition + 1,
          }
        })

        await tx.task.updateMany({
          where: {
            boardId: input.boardId,
            listId: input.listId,
            position: {
              gt: task.position
            }
          },
          data: {
            position: {
              decrement: 1
            }
          }
        })
      })
    }),
})
