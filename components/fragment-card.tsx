import { cn } from "@/lib/utils";
import { Fragment } from "@/schemas/messagesSchema";
import { Code2Icon, ChevronRightIcon } from "lucide-react";
import React from "react";

interface FragmentCardProps {
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: () => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-3 border rounded-xl w-fit px-4 py-3 transition-all duration-200 group/fragment",
        isActiveFragment
          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
          : "bg-card/50 border-border/50 hover:bg-card hover:border-border hover:shadow-sm"
      )}
      onClick={() => onFragmentClick()}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
          isActiveFragment
            ? "bg-primary-foreground/20"
            : "bg-primary/10 group-hover/fragment:bg-primary/15"
        )}
      >
        <Code2Icon
          className={cn(
            "size-4",
            isActiveFragment ? "text-primary-foreground" : "text-primary"
          )}
        />
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium line-clamp-1">
          {fragment?.title}
        </span>
        <span
          className={cn(
            "text-xs",
            isActiveFragment
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          Click to preview
        </span>
      </div>
      <ChevronRightIcon
        className={cn(
          "size-4 ml-1 transition-transform",
          isActiveFragment
            ? "text-primary-foreground/70"
            : "text-muted-foreground group-hover/fragment:translate-x-0.5"
        )}
      />
    </button>
  );
};

export default FragmentCard;
