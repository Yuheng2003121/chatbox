"use client";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="pt-18 flex justify-center items-center">
      <SignUp
        appearance={{ theme: currentTheme === "dark" ? dark : undefined }}
      />
    </div>
  );
}
