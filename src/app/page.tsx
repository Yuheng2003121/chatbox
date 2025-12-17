"use client"
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

import React, { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const {isPending, mutate} = useMutation(trpc.greetin.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job started")
    }
  }));
  const [value, setValue] = useState("");

  return (
    <div className="font-bold ">
      <input type="text" value={value} onChange={e => setValue(e.target.value)}></input>
      <Button disabled={isPending} onClick={() => mutate({ value: value })}>invoke</Button>
    </div>
  );
}
