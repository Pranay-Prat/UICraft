"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <motion.nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="relative flex h-14 w-[90vw] max-w-5xl items-center justify-between rounded-full border border-border/60 bg-popover/60 backdrop-blur-lg shadow-xl px-10"
      >
        <motion.div className="relative flex items-center h-full">
  <Link href="/" className="flex items-center h-full">
    <div className="h-8 flex items-center">
      <Image 
  src="/logo.svg" 
  alt="UICraft Logo" 
  width={120} 
  height={32} 
  priority 
  className="shrink-0 transition-transform duration-200 hover:scale-105" 
/>
    </div>
  </Link>
</motion.div>

        {/* Right Auth Buttons */}
        <div className="ml-auto flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                className="px-3 py-1.5 text-sm rounded-full bg-primary text-primary-foreground shadow transition-colors duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign In
              </motion.button>
            </SignInButton>
            <SignUpButton mode="modal">
              <motion.button
                className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground border border-border shadow transition-colors duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign Up
              </motion.button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

      </motion.div>
    </motion.nav>
  );
}

