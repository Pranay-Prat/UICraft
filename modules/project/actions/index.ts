"use server";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/modules/auth/actions";
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";
export const createProject = async (value: string) => {
  console.log("1. Starting createProject");
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  console.log("2. User authorized, creating DB record...");
  const newProject = await prisma.project.create({
    data: {
      name: generateSlug(2, { format: "kebab" }),
      userId: user.id,
      messages: {
        create: {
          content: value,
          role: MessageRole.USER,
          type: MessageType.RESULT,
        },
      },
    },
  });
  console.log("3. DB Record created:", newProject.id);
  try {
    console.log("4. Attempting inngest.send...");
    await inngest.send({
      name: "code-agent/run",
      data: {
        value: value,
        projectId: newProject.id,
      },
    });
    console.log("5. Inngest send successful");
  } catch (err) {
    console.error("CRITICAL: Inngest send failed:", err);
    throw new Error("Failed to trigger background job");
  }
  return newProject;
};
export const getProjectById = async (projectId: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });
  return project;
};
export const getProjects = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects;
};
