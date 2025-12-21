"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma/client";
import MessageLoading from "./MessageLoading";

interface MessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;

}
export default function MessagesContainer({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessagesContainerProps) {

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({
      projectId: projectId,
    }, {
      refetchInterval: 5000,
    })
  );

  
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    // 滚动到最底部（平滑）
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
    // bottomRef.current?.scrollIntoView({ behavior: "smooth",  block: 'end'  });
  };

  const lastAssistantMessageIdRef = useRef<string>(null);
  const lastUserMessageIdRef = useRef<string>(null);

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(message => message.role === "ASSISTANT")
    const lastUserMessage = messages.findLast(message => message.role === "USER")
    if(lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastAssistantMessageIdRef.current) {
      setActiveFragment(lastAssistantMessage.fragment)
      lastAssistantMessageIdRef.current = lastAssistantMessage.id
      
    } 

    if (lastUserMessage && lastUserMessage.id !== lastUserMessageIdRef.current) {
      scrollToBottom();
      lastUserMessageIdRef.current = lastUserMessage.id
    }


    
      

  }, [messages, setActiveFragment])

  // useEffect(() => {
  //   if (messages && messages.length > 0) {
  //     // 加个小延迟确保 DOM 已更新（尤其配合 suspense）
  //     const timer = setTimeout(() => {
  //       scrollToBottom();
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [messages.length]);

  if (!messages) return null;

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage.role === "USER";
  

  return (
    <div className="flex flex-col min-h-0 py-4 h-full">
      <div
        className="overflow-y-auto min-h-0 flex-1 px-4 pb-4"
        ref={containerRef}
      >
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            isActiveFragment={activeFragment?.id === message.fragment?.id}
            onFragmentClick={() => setActiveFragment(message.fragment)}
          />
        ))}
        {isLastMessageUser && <MessageLoading />}
        <div ref={bottomRef}></div>
      </div>
      <div className="relative shrink-0 px-4 pt-1">
        <div className="absolute left-0 -top-6 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none"></div>
        <div>
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
