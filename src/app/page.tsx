"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import React, { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const {data: messages} = useQuery(trpc.messages.getMany.queryOptions())
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message created");
      },
    })
  );
  const [value, setValue] = useState("");

  return (
    <div className="font-bold ">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value: value })}
      >
        invoke
      </Button>

      {messages && JSON.stringify(messages)}
    </div>
  );
}
