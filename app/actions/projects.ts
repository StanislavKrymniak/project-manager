"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function createProject(data: { name: string }) {
    try {
        const session = await auth()
        if (!session?.user?.id) return new Error("Unauthorized")

        const project = await db.project.create({
            data: {
                name: data.name,
                userId: session.user.id,
            }
        })

        revalidatePath("/dashboard")

        return { success: true, projectId: project.id }
    } catch (error) {
        console.error("Failed to create project:", error)
        return { success: false, error: "Failed to create project" }
    }
}