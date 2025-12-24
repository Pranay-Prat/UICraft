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
import { FormSchema, formSchema } from "@/schemas/formSchema";

const PROJECT_TEMPLATES = [
  {
    emoji: "🎬",
    title: "Build a Netflix clone",
    prompt:
      "Build a Netflix-style homepage with a hero banner (use a nice, dark-mode compatible gradient here), movie sections, responsive cards, and a modal for viewing details using mock data and local state. Use dark mode.",
  },
  {
    emoji: "📦",
    title: "Build an admin dashboard",
    prompt:
      "Create an admin dashboard with a sidebar, stat cards, a chart placeholder, and a basic table with filter and pagination using local state. Use clear visual grouping and balance in your design for a modern, professional look.",
  },
  {
    emoji: "📋",
    title: "Build a kanban board",
    prompt:
      "Build a kanban board with drag-and-drop using react-beautiful-dnd and support for adding and removing tasks with local state. Use consistent spacing, column widths, and hover effects for a polished UI.",
  },
  {
    emoji: "🗂️",
    title: "Build a file manager",
    prompt:
      "Build a file manager with folder list, file grid, and options to rename or delete items using mock data and local state. Focus on spacing, clear icons, and visual distinction between folders and files.",
  },
  {
    emoji: "📺",
    title: "Build a YouTube clone",
    prompt:
      "Build a YouTube-style homepage with mock video thumbnails, a category sidebar, and a modal preview with title and description using local state. Ensure clean alignment and a well-organized grid layout.",
  },
  {
    emoji: "🛍️",
    title: "Build a store page",
    prompt:
      "Build a store page with category filters, a product grid, and local cart logic to add and remove items. Focus on clear typography, spacing, and button states for a great e-commerce UI.",
  },
  {
    emoji: "🏡",
    title: "Build an Airbnb clone",
    prompt:
      "Build an Airbnb-style listings grid with mock data, filter sidebar, and a modal with property details using local state. Use card spacing, soft shadows, and clean layout for a welcoming design.",
  },
  {
    emoji: "🎵",
    title: "Build a Spotify clone",
    prompt:
      "Build a Spotify-style music player with a sidebar for playlists, a main area for song details, and playback controls. Use local state for managing playback and song selection. Prioritize layout balance and intuitive control placement for a smooth user experience. Use dark mode.",
  },
];

export default function HeroSection() {
  return (
    // Changed: Removed fixed heights, added min-h-screen to ensure background coverage
    <section className="relative w-full min-h-screen py-10 md:py-20 px-6 overflow-x-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
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
        <ProjectForm />
      </div>
    </section>
  );
}

function ProjectForm() {
  const [isFocused, setIsFocused] = React.useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "" },
  });

  const handleTemplate = (prompt: string) => {
    form.setValue("content", prompt);
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      console.log(data);
    } catch (error) {
      toast.error("Generation failed.");
      console.log(error)
    }
  };

  return (
    // Changed: Removed h-full and max-h. Using normal flex column gap.
    <div className="flex flex-col w-full gap-8">
      
      {/* Template Grid: Removed flex-1 and overflow-y-auto so it stays full size */}
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROJECT_TEMPLATES.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => handleTemplate(template.prompt)}
              className="
                group relative flex flex-col items-center justify-center gap-3
                rounded-2xl border border-border/40
                bg-card/30 backdrop-blur-sm px-4 py-6
                hover:bg-accent/40 hover:border-primary/30 hover:shadow-md
                active:scale-95 transition-all duration-200
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/50 shadow-sm">
                <span className="text-2xl">{template.emoji}</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground tracking-wide uppercase">
                {template.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form Section: This will now push the bottom of the page down */}
      <div className="space-y-6">
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/20" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.4em]">
            <span className="bg-background px-4 text-muted-foreground/30 font-bold">
              Custom Prompt
            </span>
          </div>
        </div>

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
                  placeholder="Tell us what you want to build..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  minRows={1}
                  // Removed maxRows or set it very high to allow downward expansion
                  className="resize-none border-none w-full outline-none bg-transparent text-base placeholder:text-muted-foreground/20 leading-relaxed px-2"
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
                className="h-10 w-10 rounded-xl p-0 shrink-0 shadow-lg shadow-primary/10 transition-all active:scale-90"
                type="submit"
              >
                <ArrowUpIcon className="h-5 w-5 stroke-[2.5]" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}