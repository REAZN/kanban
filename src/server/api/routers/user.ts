import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({
      // id: z.string()
      username: z.string(),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          // id: input.id,
          username: input.username,
        }
      })
    }),

  updateUsername: protectedProcedure
    .input(z.object({
      username: 
        z.string()
        .min(3, "Usernames must be at least 3 characters.")
        .max(15, "Usernames must not be longer than 15 characters.")
        .regex(/^[a-z0-9_-]+$/, "Usernames can only contain lowercase letters, numbers, underscores, and dashes."),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        
        const user = await tx.user.findUnique({
          where: {
            username: input.username,
          }
        })

        if (user?.id === ctx.session.user.id) throw new TRPCError({ code: "CONFLICT", message: "Username cannot be the same." })
        
        if (user) throw new TRPCError({ code: "CONFLICT", message: "Username already exists. :(" })

        await tx.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            username: input.username,
          }
        })
      })
    }),

  updateDisplayname: protectedProcedure
    .input(z.object({
      name:
        z.string()
        .min(1, "Display names must be at least 1 character.")
        .max(20, "Display names must not be longer than 20 characters.")
        .regex(/^[a-zA-Z0-9 ]+$/, "Display names can only contain letters and numbers."),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        }
      })
    }),

  delete: protectedProcedure
    .mutation(({ ctx }) => {
      return ctx.prisma.user.delete({
        where: {
          id: ctx.session.user.id,
        },
      })
    })
})