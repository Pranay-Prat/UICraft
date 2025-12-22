"use server"
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
export const onBoardUser = async () => {
    try {
        const user = await currentUser();
        if(!user){
            return{
                success: false,
                message: "No authenticated user found."
            }
        }
        const {id, firstName, lastName,emailAddresses,imageUrl} =user;
        const newUser = await db.user.upsert({
            where:{
                clerkId: id
            },
            update:{
                name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null,
                email: emailAddresses[0]?.emailAddress || "",
                image: imageUrl || null
            },
            create:{
                clerkId: id,
                name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null,
                email: emailAddresses[0]?.emailAddress || "",
                image: imageUrl || null
            }
        })
        return {
            success: true,
            message: "User onboarded successfully.",
            user: newUser
        }
    } catch (error) {
        console.log("Error in onBoardUser action:", error);
        return {
            success: false,
            message: "An error occurred during user onboarding."
        }
    }
}
export const getCurrentUser = async () => {
    try {
        const user = await currentUser();
        if(!user){
            return null;
        }
        const dbUser = await db.user.findUnique({
            where:{
                clerkId: user.id
            },
            select:{
                id: true,
                name: true,
                email: true,
                image: true,
                clerkId: true,
        }})
        return dbUser;
    } catch (error) {
        console.log("Error in getCurrentUser action:", error);

    }
}