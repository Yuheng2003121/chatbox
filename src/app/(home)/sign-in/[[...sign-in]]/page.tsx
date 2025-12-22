"use client"
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="pt-18 flex justify-center items-center">
      <SignIn
        appearance={{ theme: currentTheme === "dark" ? dark : undefined }}
      />
    </div>
  );
}
