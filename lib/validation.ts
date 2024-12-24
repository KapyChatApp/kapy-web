import { z } from "zod";

export const SignInSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please provide a valid email address." }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^0\d{9}$/, {
        message: "Phone number must be 10 digits and start with 0."
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter."
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter."
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character."
      }),
    confirmedPassword: z
      .string()
      .min(1, { message: "Confirmed password is required." })
  })
  .refine((data) => data.password === data.confirmedPassword, {
    path: ["confirmedPassword"],
    message: "Confirmed password does not match the password."
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

export const ForgotPassword = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter."
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter."
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character."
      }),
    confirmedPassword: z
      .string()
      .min(1, { message: "Confirmed password is required." })
  })
  .refine((data) => data.password === data.confirmedPassword, {
    path: ["confirmedPassword"],
    message: "Confirmed password does not match the password."
  });
