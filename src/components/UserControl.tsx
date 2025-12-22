"use client";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React, { useEffect, useState } from "react";

interface UserControlProps {
  showName: boolean;
}
export default function UserControl({ showName }: UserControlProps) {
  const currentTheme = useCurrentTheme();
  const [mounted, setMounted] = useState(false);

   useEffect(() => {
     setMounted(true);
   }, []);

   if (!mounted) {
     return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
   }
  return (
    <UserButton
      showName={showName}
      appearance={{ theme: currentTheme === "dark" ? dark : undefined }}
      
    ></UserButton>
  );
}
