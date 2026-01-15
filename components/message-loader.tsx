import Image from "next/image";
import React, { useState, useEffect } from "react";

const loadingMessages = [
  "Analyzing your request...",
  "Designing the layout...",
  "Writing components...",
  "Adding styling...",
  "Optimizing code...",
  "Almost there...",
];

const MessageLoader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col py-4 px-3 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
            <Image
              src={"/logo.svg"}
              alt="UICraft"
              width={18}
              height={18}
              className="opacity-80 animate-pulse"
            />
          </div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-ping" />
        </div>
        <span className="text-xs font-medium text-foreground/80">UICraft</span>
      </div>

      <div className="pl-11 flex items-center gap-3">
        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground animate-pulse">
          {loadingMessages[currentIndex]}
        </span>
      </div>
    </div>
  );
};

export default MessageLoader;
