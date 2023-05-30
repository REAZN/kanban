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
          ownerId: ctx.session.user.id,
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
        }
      });
    })
})