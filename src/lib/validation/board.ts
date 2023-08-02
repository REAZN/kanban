import { z } from "zod";

export const boardSchema = {
  get: z.object({
    boardId: z.string().optional(),
    username: z.string().optional(),
    slug: z.string().optional(),
  }),
  getAll: z.object({
    username: z.string().optional(), 
    userId: z.string(),
  }),
  create: z.object({
    name: z.string()
      .min(1, "Board names must be at least 1 character.")
      .max(128, "Board names cannot be longer than 128 characters."),
    slug: z.string()
      .min(3, "Slugs must be at least 1 characters.")
      .max(100, "Slugs cannot be longer than 100 characters.")
      .regex(/^[a-z0-9-]+$/, "Slugs can only contain lowercase letters, numbers, and dashes."),
  }),
  updateName: z.object({
    boardId: z.string(),
    name: z.string()
  })
}