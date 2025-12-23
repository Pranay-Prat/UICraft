import Navbar from '@/components/navbar';
import { onBoardUser } from '@/modules/auth/actions';
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({children}: LayoutProps) {
    await onBoardUser();
  return (
    <main className='flex flex-col min-h-screen relative overflow-x-hidden '>
        <Navbar/>
        
        <div className='fixed inset-0 -z-10 w-full 
          dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] 
          bg-[radial-gradient(#dadde2_1px,transparent_1px)] 
          bg-size-[16px_16px] 
          mask-[radial-gradient(ellipse_at_center,white,transparent_90%)]'>
        </div>

        <div className='flex-1 w-full mt-20'>
            {children}
        </div>
    </main>
  )
  }
