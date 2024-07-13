// src/schema/user.schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email" }).nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).nonempty({ message: "Password is required" }),
    passwordConfirmation: z.string().nonempty({ message: "Password confirmation is required" }),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string().nonempty({ message: "ID is required" }),
    verificationCode: z.string().nonempty({ message: "Verification code is required" }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email" }).nonempty({ message: "Email is required" }),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string().nonempty({ message: "ID is required" }),
    passwordResetCode: z.string().nonempty({ message: "Password reset code is required" }),
  }),
  body: z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).nonempty({ message: "Password is required" }),
    passwordConfirmation: z.string().nonempty({ message: "Password confirmation is required" }),
  }).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type VerifyUserInput = z.infer<typeof verifyUserSchema>["params"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
