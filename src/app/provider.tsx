import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCReactProvider >
        <ThemeProvider 
          attribute={'class'} 
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </TRPCReactProvider>
    </>
  );
}
