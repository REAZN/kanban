import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const boardRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.board.findMany({
        where: {
          member: {
            some: {
              userId: ctx.session.user.id,
            }
          },
        }
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string()
    }))
    .mutation(({ctx, input }) => {
        return ctx.prisma.board.create({
          data: {
            name: input.name,
            ownerId: ctx.session.user.id,
            member: {
              create: {
                userId: ctx.session.user.id,
                role: "OWNER",
              },
            }
          }
        }); 
    }),

  addMember: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      username: z.string(),
      role: z.enum(["MEMBER", "OWNER"])
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {

        const user = await tx.user.findUnique({
          where: {
            username: input.username,
          }
        })

        await tx.board.update({
          where: {
            id: input.boardId,
          },
          data: {
            member: {
              create: {
                userId: user?.id,
                role: input.role,
              }
            }
          }
        })
    })
  }),
})