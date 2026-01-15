"use client";
import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ProjectHeader from "./project-header";
import MessageContainer from "./message-container";
import { Fragment } from "@/schemas/messagesSchema";
import { Code, CrownIcon, EyeIcon } from "lucide-react";

// Lazy load heavy components
const FragmentWeb = dynamic(() => import("./fragment-web"), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Skeleton className="w-16 h-16 rounded-xl" />
    </div>
  ),
});

const FileExplorer = dynamic(() => import("./file-explorer"), {
  loading: () => (
    <div className="p-4 space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  ),
});

const ProjectView = ({ projectId }: { projectId: string }) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState("preview");

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ProjectHeader projectId={projectId} />
          <MessageContainer
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full flex flex-col"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value)}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger
                  value="preview"
                  className="rounded-md px-3 flex items-center gap-x-2"
                >
                  <EyeIcon className="size-4" />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="rounded-md px-3 flex items-center gap-x-2"
                >
                  <Code className="size-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm">
                  <Link href={"/pricing"} prefetch={false}>
                    <CrownIcon className="size-4 mr-1" />
                    Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent
              value="preview"
              className="flex-1 h-[calc(100%-rem)] overflow-hidden"
            >
              {activeFragment ? (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                    </div>
                  }
                >
                  <FragmentWeb data={activeFragment} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a fragment to preview it
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="code"
              className={"flex-1 h-[calc(100%-4rem)] overflow-hidden"}
            >
              {activeFragment?.files ? (
                <Suspense
                  fallback={
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-3/4" />
                    </div>
                  }
                >
                  <FileExplorer files={activeFragment.files} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a fragment to view code
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
