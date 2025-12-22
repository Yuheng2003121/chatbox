"use client"
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
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constant";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  value: z.string().min(1, { message: "Value cannot be empty" }).max(10000, {
    message: "Value is too long ",
  }),
});
export default function ProjectForm() {
  const [isFocused, setIsFocused] = useState(false);
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation(
    trpc.projects.create.mutationOptions()
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        value: values.value,
      },
      {
        onSuccess: (data) => {
          form.reset();
          queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
          queryClient.invalidateQueries(trpc.usage.status.queryOptions())

          router.push(`/projects/${data.id}`);
        },

        onError: (error) => {
          toast.error(error.message);
          if(error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn();

          } 
          if (error.data?.code === "TOO_MANY_REQUESTS") {
            router.push("/pricing");
          }

        },
      }
    );
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true
    });
  }

  return (
    <Form {...form}>
      <section className="flex flex-col gap-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar transition-all",
            isFocused && "shadow-xs"
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
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant={"outline"}
              size={"sm"}
              className="bg-white dark:bg-sidebar"
              onClick={() => onSelect(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
}
