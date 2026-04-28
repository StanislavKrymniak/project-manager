"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateTaskStatus(taskId: string, newStatus: string, projectId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) return  new Error("Unauthorized")

        await db.task.update({
            where: {
                id: taskId,
                userId: session.user.id
            },
            data: { status: newStatus }
        })

        revalidatePath(`/dashboard/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update task:", error)
        return { success: false, error: "Database update failed" }
    }
}


export async function createTask(projectId: string, data: { title: string, description?: string, priority: string }) {
    try {
        const session = await auth()
        if (!session?.user?.id) throw new Error("Unauthorized")

        await db.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: "TODO",
                priority: data.priority,
                projectId: projectId,
                userId: session.user.id,
            }
        })

        revalidatePath(`/dashboard/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to create task:", error)
        return { success: false, error: "Failed to save task" }
    }
}


export async function deleteTask(taskId: string, projectId: string) {
    try {
        // 1. Secure check: Who is calling this function?
        const session = await auth()
        if (!session?.user?.id) return new Error("Unauthorized")

        // 2. Delete the task, but ONLY if it belongs to this specific user
        await db.task.delete({
            where: {
                id: taskId,
                userId: session.user.id
            }
        })

        revalidatePath(`/dashboard/projects/${projectId}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to delete task:", error)
        return { success: false, error: "Failed to delete task" }
    }
}