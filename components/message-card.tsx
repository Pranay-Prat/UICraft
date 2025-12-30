import { Fragment } from "@/schemas/messagesSchema";
import { MessageRole, MessageType } from "@prisma/client";
import React from "react";
import { Card } from "./ui/card";
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
const UserMessage = ({content}: {content: string}) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-2 shadow-none border-none max-w-[80%] wrap-break-word">
                {content}
            </Card>
        </div>
    )
}
type AssistantMessageProps = Pick<
  MessageCardProps,
  "content" | "fragment" | "createdAt" | "isActiveFragment" | "onFragmentClick" | "type"
>;
const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}:AssistantMessageProps)=>{
    return (
        <div className={cn("flex flex-col group px-2 pb-4",
            type === MessageType.ERROR && "text-red-700")
        }>
            <div className="text-sm font-medium gap-2 pl-2 mb-2">
                <Image
                src={"/logo.svg"}
                alt="UICraft"
                height={30}
                width={30}
                />
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {format(new Date(createdAt), "HH:mm 'on' MM/dd/yyyy")}
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <span>
                    {content}
                </span>
                {fragment && type === MessageType.RESULT && (
                    <FragmentCard 
                    fragment={fragment}
                    isActiveFragment={isActiveFragment}
                    onFragmentClick={onFragmentClick}
                    />
                )}
            </div>

        </div>
    )
}
const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
    if(role === MessageRole.ASSISTANT){
       return(
         <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
        />
       )
    }
  return (
 <div className="mt-5">
      <UserMessage content={content} />
    </div>)
};

export default MessageCard;
