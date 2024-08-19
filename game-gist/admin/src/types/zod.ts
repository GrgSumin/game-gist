import { z } from "zod";

export const NewsSchema = z.object({
  title: z.string().min(10, { message: "At least 10 words" }),
  //   isHeadline: z.boolean(),
  short_desc: z.string().min(10, { message: "Atleast 10 words" }),
  description: z.string().min(50, { message: "At least 50 words" }),
  url: z.string(),
  image: z
    .any()
    .refine((file) => !!file[0], "Load a proper image")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(file[0]?.type),
      "please enter a valid image "
    )
    .refine((file) => file[0]?.size <= 1024 * 1024 * 2, "Max size is 2 MB"),
});

export type Schema = z.infer<typeof NewsSchema>;
