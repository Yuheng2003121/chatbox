"use client"
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return <SignIn appearance={{theme: currentTheme === 'dark' ? dark: undefined}}/>;
}
