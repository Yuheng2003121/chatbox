import { messagesRouter } from "@/modules/messages/server/procedures";
import {  createTRPCRouter } from "../init";
import { greetingRouter } from "./greeting";
import { projectsRouter } from "@/modules/projects/server/procedures";
export const appRouter = createTRPCRouter({
  greetin: greetingRouter,
  messages: messagesRouter,
  projects: projectsRouter
 
});
// export type definition of API
export type AppRouter = typeof appRouter;
