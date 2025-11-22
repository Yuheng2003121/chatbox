import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Home() {
  const users = await prisma.user.findMany();

  return <div className="font-bold">
    {JSON.stringify(users, null, 2)}
  </div>;
}
