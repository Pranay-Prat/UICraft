import { Fragment } from '@/schemas/messagesSchema';
import React,{useState} from 'react'
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Hint } from './ui/hint';
type FragmentWebProps = {
  data: Fragment | null;
}
const FragmentWeb = ({ data }: FragmentWebProps) => {
  return (
    <div className='flex flex-col w-full h-full'>
        <div className='p-2 border-b bg-sidebar flex items-center gap-x-2'>
            <Hint>
                <Button size={"sm"} variant={"outline"} onClick={onRefresh}>
                <RefreshCcw className='size-4'/>
            </Button>
            </Hint>
            <Button>
                
            </Button>
        </div>
    </div>
  )
}

export default FragmentWeb