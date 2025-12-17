// trpc/routers/greeting.ts
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init"; // ✅ 导入 createTRPCRouter
import { inngest } from "@/inngest/client";

export const greetingRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input }) => {
      return { greeting: `Hello, ${input.name}!` };
    }),

  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          value: input.value,
        },
      });
    }),
});
