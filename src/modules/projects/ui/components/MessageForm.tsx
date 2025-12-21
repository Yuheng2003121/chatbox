import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MessageFormProps {
  projectId: string;
}

const formSchema = z.object({
  value: z.string().min(1, { message: "Value cannot be empty" }).max(10000, {
    message: "Value is too long ",
  }),
});
export default function MessageForm({ projectId }: MessageFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation(
    trpc.messages.create.mutationOptions()
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        value: values.value,
        projectId: projectId,
      },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries(
            trpc.messages.getMany.queryOptions({ projectId })
          );
        },

        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isPending}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="what would you like to build?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // 只有「没按 Shift」时才提交（即：Enter 或 Ctrl/Cmd+Enter）
                  if (!e.shiftKey) {
                    e.preventDefault(); // 阻止换行
                    form.handleSubmit(onSubmit)(e);
                  }
                  // ⚠️ 如果按了 Shift+Enter → 不 preventDefault，保留换行默认行为
                }
              }}
            />
          )}
        />
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-1 items-center text-muted-foreground font-mono text-[10px]">
            <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded-sm border bg-muted px-1.5 py-1 font-medium">
              <span>&#8984;</span> Enter
            </kbd>
            &nbsp;to Submit
          </div>
          <Button
            disabled={isPending || !form.formState.isValid}
            className={cn(
              "size-8 rounded-full",
              (isPending || !form.formState.isValid) && "bg-muted-foreground"
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
