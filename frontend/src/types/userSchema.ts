import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email format" });
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(30, { message: "Password cannot exceed 30 characters" });
const nameSchema = z
  .string()
  .min(2, { message: "Name must be at least 2 characters" })
  .max(30, { message: "Name cannot exceed 30 characters" });

export const CreateUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional(),
});
