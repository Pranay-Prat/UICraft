import z from "zod";
export const formSchema = z.object({
  content: z
    .string()
    .min(10, "Project Description is required")
    .max(1000, "Content must be at most 1000 characters"),
});
export type FormSchema = z.infer<typeof formSchema>;
