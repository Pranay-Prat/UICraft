"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import {
  messageFormSchema,
  messageformSchema,
} from "@/schemas/messageFormSchema";
import { useCreateMessages } from "@/modules/messages/hooks/messages";
import { Spinner } from "./ui/spinner";
import { useStatus } from "@/modules/usage/hooks/usage";
import Usage from "./usage";

function MessageForm({ projectId }: { projectId: string }) {
  const [isFocused, setIsFocused] = React.useState(false);

  const { mutateAsync, isPending } = useCreateMessages(projectId);
  const { data: usage } = useStatus();
  const form = useForm<messageformSchema>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: messageformSchema) => {
    try {
      await mutateAsync(data.content);
      toast.success("Message created!");
      form.reset();
    } catch (error) {
      toast.error("Message sending failed. Please try again.");
      console.error("Message generation error:", error);
    }
  };

  const contentValue = form.watch("content");
  const isButtonDisabled = isPending || !contentValue?.trim();

  return (
    <Form {...form}>
      {usage && <Usage />}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border border-border/50 p-4 rounded-2xl bg-card/50 backdrop-blur-xl transition-all duration-300",
          isFocused &&
            "ring-2 ring-primary/30 border-primary/40 bg-card/80 shadow-lg shadow-primary/5"
        )}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <TextAreaAutosize
              {...field}
              disabled={isPending}
              placeholder="Describe what you want to build..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                field.onBlur();
              }}
              minRows={1}
              maxRows={6}
              className={cn(
                "resize-none border-none w-full outline-none bg-transparent text-sm placeholder:text-muted-foreground/40 leading-relaxed px-1 scrollbar-hide",
                isPending && "opacity-50 cursor-not-allowed"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="size-3 text-primary/40" />
            <span className="text-xs text-muted-foreground/40 font-medium">
              ⌘ + Enter to send
            </span>
          </div>
          <Button
            className={cn(
              "size-8 rounded-full p-0 shrink-0 transition-all duration-200",
              isButtonDisabled
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg active:scale-95"
            )}
            type="submit"
            disabled={isButtonDisabled}
          >
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              <ArrowUpIcon className="size-4 stroke-[2.5]" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default MessageForm;
