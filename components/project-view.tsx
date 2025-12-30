"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import ProjectHeader from "./project-header";
import MessageContainer from "./message-container";
import { Fragment } from "@/schemas/messagesSchema";
const ProjectView = ({ projectId }: { projectId: string }) => {
  const [activeFragment,setActiveFragment] = useState<Fragment | null>(null)
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ProjectHeader projectId={projectId} />
          <MessageContainer projectId={projectId} activeFragment={activeFragment} setActiveFragment={setActiveFragment}></MessageContainer>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
