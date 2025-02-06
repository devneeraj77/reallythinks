import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Username should be at least 3 characters long"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
