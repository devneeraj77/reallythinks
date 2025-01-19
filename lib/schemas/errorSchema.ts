import { z } from "zod";

// Zod schema to validate error messages
export const errorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.string().optional(),
});

// Type for error validation
export type ErrorSchema = z.infer<typeof errorSchema>;
