import Image from "next/image";
import React, { useEffect, useState } from "react";

const messages = [
  "Thinking...",
  "Loading...",
  "Generating...",
  "Analyzing your request...",
  "Building your website...",
  "Crafting components...",
  "Optimizing layout...",
  "Adding final touches...",
  "Almost ready...",
];

function ShimmerMessage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
}

export default function MessageLoading() {
  return (
    <div className="flex gap-2 group">
      <div>
        <Image
          src={"/aiLogo.svg"}
          alt="logo"
          width={30}
          height={30}
          className="shrink-0"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-bold">Vibe</span>
        <ShimmerMessage />
      </div>
    </div>
  );
}
