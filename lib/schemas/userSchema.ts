import { string, z } from "zod";

// User schema for signup ===> registration
export const UserSignupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must only contain letters, numbers, and underscores"
    ),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be less than 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be less than 50 characters long"),
});

// User schema for login (credentials)
export const userLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// User schema for NextAuth session data
export const userSessionSchema = z.object({
  username: z.string(),
  email: z.string(),
  profilePic: z.string().optional(),
  lastActive: z.date().optional(),
});
