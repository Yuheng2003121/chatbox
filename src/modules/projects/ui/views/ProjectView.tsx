"use client";
import { Suspense, useState } from "react";
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import MessagesContainer from "../components/MessagesContainer";
import { Fragment } from "@/generated/prisma/client";
import ProjectHeader from "../components/ProjectHeader";
import FragmentWeb from "../components/FragmentWeb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TabsContent } from "@radix-ui/react-tabs";
import FileExplorer, { FileCollection } from "@/components/codeView/FileExplorer";
import UserControl from "@/components/UserControl";
import { useAuth } from "@clerk/nextjs";
export default function ProjectView({ projectId }: { projectId: string }) {
  const {has} = useAuth();
  const isProAccess = has?.({plan: 'pro'})

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={10} className="flex flex-col">
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-full flex justify-center items-center">
                Loading Messages...
              </div>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="z-100" />
        <ResizablePanel defaultSize={80} minSize={50}>
          <Tabs
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
            className="h-full!"
          >
            <div className="flex p-4 justify-between gap-2 border-b">
              <TabsList className="border">
                <TabsTrigger value="preview">
                  <EyeIcon />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                {!isProAccess && (
                  <Button asChild size="sm" variant={"teritary"}>
                    <Link href={"/pricing"}>
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl showName={false} />
              </div>
            </div>
            <TabsContent value="preview" className="h-full min-h-0">
              {activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="h-full min-h-0">
              {/* <CodeView lang="ts" code="const text = 'Hello World'"/> */}
              {activeFragment && (
                <FileExplorer files={activeFragment.files as FileCollection} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
