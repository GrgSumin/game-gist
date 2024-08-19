import { z } from "zod";
export const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  username: z.string().min(5, { message: "should be at least 5 words" }),
  password: z
    .string()
    .min(8, { message: "Password should be more tha 8 characters" }),
  phonenumber: z.number(),
});

export type Schema = z.infer<typeof FormSchema>;
