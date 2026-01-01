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
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";



export default function HeroSection({projectId}: {projectId: string}) {
  return (
    <section className="relative w-full min-h-screen py-10 md:py-20 px-6 overflow-x-hidden bg-background">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
        {/* Fixed: w-125 is not standard, used w-[500px] instead */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 max-w-2xl">
          Build your next interface{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
            faster than ever
          </span>
        </h1>

        <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
          Describe your layout or select a template to generate production-ready
          React components.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700">
        <MessageForm projectId={projectId} />
      </div>
    </section>
  );
}

function MessageForm({projectId}: {projectId?: string}) {
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
                  className="resize-none border-none w-full outline-none bg-transparent text-base placeholder:text-muted-foreground/20 leading-relaxed px-2 scrollbar-hide"
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
                  isButtonDisabled 
                    ? "bg-muted text-muted-foreground border border-border/50 cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 text-primary-foreground active:scale-90"
                )}
                type="submit"
                disabled={isButtonDisabled}
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