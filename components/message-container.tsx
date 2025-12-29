import React, { useEffect, useRef } from 'react'
import { useGetMessages,prefetchMessages } from '@/modules/messages/hooks/messages'
import { MessageRole } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { Spinner } from './ui/spinner'
const MessageContainer = ({projectId,activeFragment,setActiveFragment}:{
    projectId:string, activeFragment:unknown, setActiveFragment:unknown
}) => {
    const queryClient = useQueryClient();
    const bottomRef = useRef(null)
    const lastAssistantMessageIdRef = useRef(null)
    const {data:messages,isPending,isError, error} = useGetMessages(projectId)
    useEffect(()=>{
        if(projectId){
            prefetchMessages(queryClient,projectId)
        }
    },[projectId,queryClient])
    if(isPending){
        return(
            <div className='flex items-center justify-center h-full'>
                <Spinner className='text-emerald-400' />
            </div>
        )
    }
    if(isError){
        return (
            <div className='flex items-center justify-center h-full text-red-500'>
                Error: {error?.message || "Failed to load messages"}
            </div>
        )
    }
    if(!messages || messages.length === 0 ){
        return (
            <div className='flex flex-col flex-1 min-h-0'>
                <div className='flex-1 flex items-center justify-center text-muted-foreground'>
                    No Messages Yet. Start a conversation
                </div>
                <div className='relative p-3 pt-1'>
                    <div className='absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none'>

                    </div>
                </div>
            </div>
        )
    }
    return (
    <div className=''>
        
    </div>
  )
}

export default MessageContainer