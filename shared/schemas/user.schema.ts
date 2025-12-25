import { z , ZodEnum} from "zod";
import { countrySchema } from "./country";

export const userRegisterSchema = z
  .object({
    userName: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(30, "Username cannot exceed 30 characters"),

    email: z.string().email("Invalid Email"),

    age: z.coerce.number().min(0, "Age Cannot be negative"),

    gender: z.enum(["male", "female", "other"]),

    country:countrySchema,

    password: z
      .string()
      .min(6, "Minimum length must be 6")
      .max(12, "Maximum length can be 12 "),
    confirmPassword: z
      .string()
      .min(6, "Minimum length must be 6")
      .max(12, "Maximum length can be 12 ")
      .optional(),

    isAccepted: z.coerce.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
