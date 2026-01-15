import { Fragment } from "@/schemas/messagesSchema";
import { MessageRole, MessageType } from "@prisma/client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import FragmentCard from "./fragment-card";

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment?: Fragment | null;
  createdAt: Date | string;
  isActiveFragment: boolean;
  onFragmentClick: () => void;
  type: MessageType;
}

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end py-3 pr-3 pl-12">
      <div className="rounded-2xl rounded-br-md bg-primary/10 border border-primary/20 px-4 py-3 max-w-[85%] text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
};

type AssistantMessageProps = Pick<
  MessageCardProps,
  | "content"
  | "fragment"
  | "createdAt"
  | "isActiveFragment"
  | "onFragmentClick"
  | "type"
>;

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group py-4 px-3 rounded-xl transition-colors hover:bg-muted/30",
        type === MessageType.ERROR && "bg-red-500/5 border border-red-500/20"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
            <Image
              src={"/half_logo.svg"}
              alt="UICraft"
              height={18}
              width={28}
              className="opacity-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground/80">
            UICraft
          </span>
          <span className="text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
            {format(new Date(createdAt), "h:mm a · MMM d")}
          </span>
        </div>
      </div>

      <div className="pl-11 flex flex-col gap-4">
        <p
          className={cn(
            "text-sm leading-relaxed text-foreground/90",
            type === MessageType.ERROR && "text-red-400"
          )}
        >
          {content}
        </p>
        {fragment && type === MessageType.RESULT && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === MessageRole.ASSISTANT) {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return <UserMessage content={content} />;
};

export default MessageCard;
