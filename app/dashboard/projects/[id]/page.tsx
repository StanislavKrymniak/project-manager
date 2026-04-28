import KanbanBoard from "@/components/kanban-board"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/login")
    }
    const userId = session.user.id

    const resolvedParams = await params
    const projectId = resolvedParams.id

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(projectId)
    if (!isValidObjectId) {
        return <div className="p-10 text-red-500">Error: Invalid Project ID format.</div>
    }

    let project = await db.project.findUnique({
        where: { id: projectId }
    })

    if (project && project.userId !== userId) {
        return (
            <div className="p-10 flex flex-col items-center justify-center h-full space-y-4">
                <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
                <p className="text-muted-foreground">You do not have permission to view this project.</p>
            </div>
        )
    }

    if (!project) {
        project = await db.project.create({
            data: { id: projectId, name: "My Personal Project", userId: userId }
        })
    }

    const tasks = await db.task.findMany({
        where: { projectId: projectId, userId: userId },
        orderBy: { createdAt: 'asc' }
    })

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-sm text-muted-foreground">Workspace for {session.user.name}</p>
            </div>

            <KanbanBoard
                initialTasks={tasks}
                projectId={projectId}
            />
        </div>
    )
}