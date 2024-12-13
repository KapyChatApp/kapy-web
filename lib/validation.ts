import { z } from "zod";

export const SignInScema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, {
      message: "Phone number must be 10 digits and start with 0."
    })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannit exceed 100 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter."
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter."
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character."
    })
});

export const ChangePassword = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannit exceed 100 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter."
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter."
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character."
    })
});
