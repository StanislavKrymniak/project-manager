import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Clock, ListTodo, Activity } from "lucide-react"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardOverview() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/login")
    }

    const userId = session.user.id

    // 1. Fetch the stats AND the 5 most recently updated tasks in one go
    const [totalProjects, inProgressTasks, completedTasks, recentActivity] = await Promise.all([
        db.project.count({ where: { userId } }),
        db.task.count({ where: { userId, status: "IN_PROGRESS" } }),
        db.task.count({ where: { userId, status: "DONE" } }),
        db.task.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" }, // Sort by newest updates first
            take: 5, // Only grab the top 5
            include: { project: true } // Include project name for context
        })
    ])

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">
                    Welcome back, {session.user.name}. Here is a summary of your workspace.
                </p>
            </div>

            {/* Top Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <ListTodo className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjects}</div>
                        <p className="text-xs text-muted-foreground">Active in your workspace</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks in Progress</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground">Currently being worked on</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedTasks}</div>
                        <p className="text-xs text-muted-foreground">Done and dusted</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card className="flex-1 shadow-sm border-primary/10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <CardTitle>Recent Activity</CardTitle>
                    </div>
                    <CardDescription>Your latest task updates across all projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentActivity.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No recent activity found.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentActivity.map((task) => (
                                <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{task.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            in <span className="font-semibold text-foreground/80">{task.project.name}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            task.status === "DONE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                        }`}>
                                            {task.status.replace("_", " ")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}