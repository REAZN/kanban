import { z } from "zod"


export const userSchema = {
  get: z.object({
    username: z.string(),
  }),
  updateUsername: z.object({
    username: 
      z.string().toLowerCase()
      .min(3, "Usernames must be at least 3 characters.")
      .max(20, "Usernames cannot not be longer than 20 characters.")
      .regex(/^[a-z0-9_-]+$/, "Usernames can only contain lowercase letters, numbers, underscores, and dashes."),
  }),
  updateDisplayname: z.object({
    name:
      z.string()
      .min(1, "Display names must be at least 1 character.")
      .max(20, "Display names must not be longer than 20 characters.")
      .regex(/^[a-zA-Z0-9 ]+$/, "Display names can only contain letters and numbers."),
  })
}