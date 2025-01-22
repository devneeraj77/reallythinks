import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string().optional(),
  sender: z.string().optional(), // Optional for anonymity
  receiver: z.string(),
  content: z
    .string()
    .min(1)
    .max(50),
  timestamp: z.number().default(() => Date.now()),
});

export type Message = z.infer<typeof MessageSchema>;
