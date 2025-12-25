import { z } from "zod";
import { userRegisterSchema } from "../user.schema";

export const forgotPasswordSchema = z.object({
  email: userRegisterSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(32, "Invalid token"),
    newPassword: userRegisterSchema.shape.password,
    confirmPassword: userRegisterSchema.shape.password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
