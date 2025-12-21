import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface ProjectHeaderProps {
  projectId: string;
}

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const trpc = useTRPC();
  const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
    id: projectId,
  }))

  const {theme, setTheme} = useTheme();

  
  return (
    <header className="p-2 flex justify-between items-center border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"sm"}
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-60 transition-all"
          >
            <Image src={"/aiLogo.svg"} alt="Vibe" width={30} height={30} />
            <span className="font-bold">{project.name}</span>
            <ChevronDownIcon className="" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="px-2 py-2"> 
          <DropdownMenuItem asChild>
            <Link href={"/"}>
              <ChevronLeftIcon/>
              <span>Go to dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger >
              <SunMoonIcon className="size-4 text-muted-foreground"/>
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal> 
              <DropdownMenuSubContent> 
                <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
           
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
