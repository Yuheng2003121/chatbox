import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project Id cannot be empty" }),
      })
    )
    .query(async ({ input }) => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const messages = await prisma.message.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: "asc" },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value cannot be empty" })
          .max(10000, {
            message: "Value is too long ",
          }),
        projectId: z.string().min(1, { message: "Project Id cannot be empty" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId,
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});
