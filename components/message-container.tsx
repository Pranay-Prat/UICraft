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
      <div className="flex items-center justify-center h-full">
        <Spinner className="text-emerald-400" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error?.message || "Failed to load messages"}
      </div>
    );
  }
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No Messages Yet. Start a conversation
        </div>
        <div className="relative p-3 pt-1">
          <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none"></div>
        </div>
      </div>
    );
  }
  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage.role === MessageRole.USER;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
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
        <div ref={bottomRef}>
        </div>
      </div>
      <div className="p-2 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none">
            <MessageForm projectId={projectId}/>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
