import { cn } from '@/lib/utils';
import { Fragment } from '@/schemas/messagesSchema';
import { ChevronRightIcon, Code2Icon } from 'lucide-react';
import React from 'react'
interface FragmentCardProps {
  fragment: Fragment | null; 
  isActiveFragment: boolean;
  onFragmentClick: () => void;
}
const FragmentCard = ({ 
  fragment, 
  isActiveFragment, 
  onFragmentClick 
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-2 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick()}
    >
        <Code2Icon className='size-4 mt-8.5'/>
        <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment?.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <span className="text-sm">
          <ChevronRightIcon className="size-4" />
        </span>
      </div>
    </button>
  )
}

export default FragmentCard