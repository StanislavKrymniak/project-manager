import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {getPriorityColor} from "@/lib/utils";


export default async function MyTasksPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Fetch all tasks for the user, include the project name so we know where it belongs!
    const tasks = await db.task.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: { project: true } // Joins the Project table automatically!
    })

    // Helper function to color-code our new priorities


    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                <p className="text-sm text-muted-foreground">A master list of everything you need to do.</p>
            </div>

            <div className="grid gap-4">
                {tasks.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                        You don't have any tasks yet. Go to a project to create one!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="flex flex-row items-center justify-between p-4 shadow-sm hover:bg-muted/30 transition-colors">
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-lg">{task.title}</span>
                                <span className="text-sm text-muted-foreground">
                  Project: {task.project.name} • Status: {task.status.replace("_", " ")}
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                    {task.priority} Priority
                                </Badge>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}