import { z } from "zod";
import { countrySchema } from "./country";

export const counselorRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name can't be longer than 50 characters"),

    middleName: z
      .string()
      .max(50, "Middle name can't be longer than 50 characters")
      .optional(),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name can't be longer than 50 characters"),

    email: z.string().email("Invalid Email"),

    age: z.coerce
      .number()
      .int("Age must be an integer")
      .min(0, "Age cannot be negative"),

    gender: z.enum(["male", "female", "other"]),

    country: countrySchema,
    
    password: z
      .string()
      .min(6, "Minimum length must be 6")
      .max(12, "Maximum length can be 12"),

    confirmPassword: z
      .string()
      .min(6, "Minimum length must be 6")
      .max(12, "Maximum length can be 12"),

    isAccepted: z.coerce.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type CounselorRegisterInput = z.infer<typeof counselorRegisterSchema>;
