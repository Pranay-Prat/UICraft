"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex h-14 w-[90vw] max-w-5xl items-center justify-between rounded-full border border-border/60 bg-popover/60 backdrop-blur-lg shadow-xl px-10">
        <div className="relative flex items-center h-full">
          <Link href="/" className="flex items-center h-full">
            <div className="h-8 flex items-center justify-start">
              <motion.div
                initial={{ width: "32px" }}
                animate={{ width: "138px" }}
                transition={{
                  duration: 1.1,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden flex items-center whitespace-nowrap"
              >
                <Image
                  src="/logo.svg"
                  alt="UICraft Logo"
                  width={138}
                  height={32}
                  priority
                  className="shrink-0 min-w-34.5 transition-transform duration-200 hover:scale-105 object-left"
                />
              </motion.div>
            </div>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground shadow transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-1.5 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border border-border shadow transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
