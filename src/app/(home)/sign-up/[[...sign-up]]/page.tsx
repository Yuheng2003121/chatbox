"use client";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <SignUp
      appearance={{ theme: currentTheme === "dark" ? dark : undefined }}
    />
  );
}
