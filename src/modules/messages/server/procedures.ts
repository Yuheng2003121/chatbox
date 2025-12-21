import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project Id cannot be empty" }),
      })
    )
    .query(async ({ input, ctx }) => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const messages = await prisma.message.findMany({
        where: { 
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId
          }
         },
        orderBy: { createdAt: "asc" },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),
  create: protectedProcedure
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
    .mutation(async ({ input, ctx }) => {
      const existedProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId
        }
      })

      if(!existedProject){
        throw new TRPCError({code:"NOT_FOUND", message: "Project not found" })
      }

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
          projectId: existedProject.id,
        },
      });

      return createdMessage;
    }),
});
