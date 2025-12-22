"use client";

import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="max-w-3xl w-full mx-auto h-full">
      <section className="pt-[16vh] 2xl:pt-38 flex flex-col gap-5 items-center justify-center">
        <Image src={"/aiLogo.svg"} alt="Vibe" width={48} height={48} />
        <h1 className="font-bold text-4xl">Pricing</h1>
        <h3 className="text-sm md:text-base text-muted-foreground">
          Choose the plan that fit your need
        </h3>
        <PricingTable
          appearance={{
            theme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      </section>
    </div>
  );
}
