"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import { messageFormSchema,messageformSchema } from "@/schemas/messageFormSchema";
import { useCreateMessages } from "@/modules/messages/hooks/messages";
import { Spinner } from "./ui/spinner";


function MessageForm({projectId}: {projectId: string}) {
  const [isFocused, setIsFocused] = React.useState(false);

  const { mutateAsync, isPending } = useCreateMessages(projectId);
  
  const form = useForm<messageformSchema>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  });


  const onSubmit = async (data: messageformSchema) => {
    try {
      const res = await mutateAsync(data.content);
      toast.success("Message created!");
      form.reset();
    } catch (error) {
      toast.error("Message sending failed. Please try again.");
      console.error("Message generation error:", error);
    }
  };

  return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "relative border p-4 rounded-4xl bg-sidebar/20 backdrop-blur-xl transition-all shadow-sm",
              isFocused &&
                "ring-1 ring-primary/20 border-primary/30 bg-sidebar/40 shadow-lg shadow-primary/5"
            )}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <TextAreaAutosize
                  {...field}
                  disabled={isPending}
                  placeholder="Tell us what you want to build..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    field.onBlur();
                  }}
                  minRows={1}
                  className={cn("resize-none border-none w-full outline-none bg-transparent text-base placeholder:text-muted-foreground/20 leading-relaxed px-2 scrollbar-hide",isPending && "opacity-50 cursor-not-allowed")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                />
              )}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/10">
              <div className="flex items-center gap-3 px-2">
                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border/40 bg-muted/20 px-2 font-mono text-[10px] font-medium text-muted-foreground/30">
                  <span className="text-[12px]">⌘</span>ENTER
                </kbd>
                <span className="text-[10px] text-muted-foreground/20 font-bold uppercase tracking-widest">
                  to generate
                </span>
              </div>
              <Button
                className={cn(
                  "size-8 rounded-full p-0 shrink-0 shadow-lg shadow-primary/10 transition-all",
                  isPending 
                    ? "bg-muted text-muted-foreground border border-border/50 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 text-primary-foreground active:scale-90"
                )}
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5 stroke-[2.5]" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      
  );
}
export default MessageForm;