"use client"
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

interface UserControlProps {
  showName: boolean;
}
export default function UserControl({ showName }: UserControlProps) {
  const currentTheme = useCurrentTheme();
  return <UserButton showName={showName} appearance={{theme: currentTheme === 'dark' ? dark: undefined}}></UserButton>;
}
