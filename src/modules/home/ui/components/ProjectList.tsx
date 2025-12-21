"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ProjectList() {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  return (
    <div className="border rounded-lg w-full bg-secondary dark:bg-sidebar rouned-xl flex flex-col gap-6 sm:gap-4 p-8">
      <h2 className="text-xl md:text-2xl font-bold">Saved Vibes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full">No projects Found</div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant={"outline"}
            className="w-full h-auto p-4! justify-start "
            asChild
          >
            <Link
              href={`/projects/${project.id}`}
              className="flex items-center gap-4"
            >
              <Image src={"/aiLogo.svg"} alt="Vibe" width={32} height={32} className="object-contain" />
              <div>
                <h3 className="font-medium truncate">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(project.createdAt)}
                </p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
