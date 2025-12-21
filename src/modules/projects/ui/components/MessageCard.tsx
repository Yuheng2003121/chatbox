import React from "react";
import UserMessage from "./UserMessage";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Fragment, Message } from "@/generated/prisma/client";
import { ChevronRight, Code2Icon } from "lucide-react";

interface MessageCardProps {
  message: Message & { fragment: Fragment | null };
  isActiveFragment: boolean;
  onFragmentClick: () => void;
}

const AssistantMessage = ({
  message,
  isActiveFragment,
  onFragmentClick,
}: MessageCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 group pb-4",
        message.type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex gap-2">
        <div>
          <Image
            src={"/aiLogo.svg"}
            alt="logo"
            width={30}
            height={30}
            className="shrink-0"
          />
        </div>

        <div className="flex-1 pr-4 flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <span className="font-bold">Vibe</span>
            <span className="text-sm font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {format(message.createdAt, "HH:mm 'on' MMM dd, yyyy")}
            </span>
          </div>
          <div className="leading-loose">{message.content}</div>

          <div className="mt-4">
            {message.fragment && (
              <FragmentCard
                fragment={message.fragment}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MessageCard({
  message,
  isActiveFragment,
  onFragmentClick,
}: MessageCardProps) {
  if (message.role === "ASSISTANT") {
    return (
      <AssistantMessage
        message={message}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
      />
    );
  }

  if (message.role === "USER") {
    return <UserMessage content={message.content} />;
  }

  return <div></div>;
}

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}
const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex flex-col gap-1 py-3 px-4 border rounded-lg w-fit transition-colors bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        isActiveFragment &&
          "bg-primary! text-primary-foreground border-primary hover:text-primary-foreground/70"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <div className="flex gap-2 items-center">
        <Code2Icon className="size-4" />
        <span>{fragment.title}</span>
        <ChevronRight className="size-4" />
      </div>
      <span className="text-sm">preview</span>
    </button>
  );
};
