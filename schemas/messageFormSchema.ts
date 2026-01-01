import z from "zod";
export const messageFormSchema = z.object({
  content: z
    .string()
    .min(10, "Message Description is required")
    .max(1000, "Content must be at most 1000 characters"),
});
export type messageformSchema = z.infer<typeof messageFormSchema>;
