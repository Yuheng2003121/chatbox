import { messagesRouter } from "@/modules/messages/server/procedures";
import {  createTRPCRouter } from "../init";
import { greetingRouter } from "./greeting";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { usagesRouter } from "@/modules/usage/server/procedures";
export const appRouter = createTRPCRouter({
  greetin: greetingRouter,
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usagesRouter
 
});
// export type definition of API
export type AppRouter = typeof appRouter;
