import { TRPCReactProvider } from "@/trpc/client";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
   
    <>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </>
  );
}
