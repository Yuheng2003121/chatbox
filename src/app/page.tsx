"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const router = useRouter();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`projects/${data.id}`)
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [value, setValue] = useState("");

  return (
    <div className="h-screen flex justify-center items-center gap-4">
      <div className="max-w-8xl flex flex-col gap-4 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></input>
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          invoke
        </Button>
      </div>
    </div>
  );
}
