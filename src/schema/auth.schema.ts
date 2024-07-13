// src/schema/auth.schema.ts
import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email" }).nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).nonempty({ message: "Password is required" }),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>["body"];
