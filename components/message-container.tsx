import React, { useEffect, useRef } from "react";
import {
  useGetMessages,
  prefetchMessages,
} from "@/modules/messages/hooks/messages";
import { MessageRole } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import MessageCard from "./message-card";
import { Fragment } from "@/schemas/messagesSchema";
import MessageForm from "./message-form";
import MessageLoader from "./message-loader";
import { MessageSquare } from "lucide-react";

interface MessageContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessageContainerProps) => {
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);
  const {
    data: messages,
    isPending,
    isError,
    error,
  } = useGetMessages(projectId);

  useEffect(() => {
    if (projectId) {
      prefetchMessages(queryClient, projectId);
    }
  }, [projectId, queryClient]);

  useEffect(() => {
    const lastAssistantMessage = messages?.findLast(
      (message) => message.role === MessageRole.ASSISTANT
    );
    if (
      lastAssistantMessage?.fragments &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage?.fragments);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [setActiveFragment, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Spinner className="text-primary size-6" />
        <span className="text-sm text-muted-foreground">
          Loading messages...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-red-500">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <MessageSquare className="size-5" />
        </div>
        <span className="text-sm">
          Error: {error?.message || "Failed to load messages"}
        </span>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <MessageSquare className="size-7 text-primary/50" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground/70">
              No messages yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a conversation below
            </p>
          </div>
        </div>
        <div className="relative p-4">
          <MessageForm projectId={projectId} />
        </div>
      </div>
    );
  }

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage.role === MessageRole.USER;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="py-4 space-y-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragments}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragments?.id}
              onFragmentClick={() => setActiveFragment(message.fragments)}
              type={message.type}
            />
          ))}
          {isLastMessageUser && <MessageLoader />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="relative p-4 pt-2">
        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessageContainer;
