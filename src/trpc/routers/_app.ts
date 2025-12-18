import { messagesRouter } from "@/modules/messages/server/procedures";
import {  createTRPCRouter } from "../init";
import { greetingRouter } from "./greeting";
export const appRouter = createTRPCRouter({
  greetin: greetingRouter,
  messages: messagesRouter
 
});
// export type definition of API
export type AppRouter = typeof appRouter;
