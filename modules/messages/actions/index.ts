"use server"
import { MessageRole, MessageType } from "@prisma/client"
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/modules/auth/actions";
import { consumeCredits } from "@/lib/usage";
export const createMessages = async(value:string,projectId:string)=>{
    const user = await getCurrentUser();
    if(!user){
        throw new Error("Unauthorized")

    }
    const project = await prisma.project.findUnique({
        where:{
            id:projectId,
            userId:user.id
        }
    })
    if(!project){
        throw new Error("Project not found")
    }
  try {
  await consumeCredits();
} catch (error) {
  if (error instanceof Error) {
    const err = new Error("Some error occurred while consuming credits: " + error.message);
    (err as any).code = "BAD_REQUEST"; 
    throw err;
  } else {

    const err = new Error("You have exceeded your usage limits. Please upgrade your plan to continue using the service.");
    (err as any).code = "Too Many Requests";
    throw err;
  }
}
    const newMessage = await prisma.message.create({
        data:{
            projectId:projectId,
            content:value,
            role:MessageRole.USER,
            type:MessageType.RESULT
        }
    }) 
    await inngest.send({
        name:"code-agent/run",
        data:{
            value:value,
            projectId:projectId
        }
    })

    return newMessage
}
export const getMessages =async(projectId:string)=>{
    const user = await getCurrentUser();
    if(!user){
        throw new Error("Unauthorized")
    }
    const project = await prisma.project.findUnique({
        where:{
            id:projectId,
            userId:user.id
        }
    })
    if(!project){
        throw new Error("Project not found")
    }
    const messages= await prisma.message.findMany({
        where:{
            projectId:projectId
        },
        orderBy:{
            updatedAt:"asc"
        },
        include:{
            fragments:true
        }
    })
    return messages
}