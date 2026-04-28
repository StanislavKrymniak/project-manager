import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreateProjectModal } from "@/components/create-project-modal"
import { FolderKanban } from "lucide-react"


export default async function ProjectsPage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/login")
    }

    // Fetch all projects belonging to the logged-in user
    const projects = await db.project.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between max-[450px]:flex-col">
                <div className="max-[450px]:pb-5">
                    <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
                    <p className="text-sm text-muted-foreground">Select a project or create a new one.</p>
                </div>
                <CreateProjectModal />
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 border-2 border-dashed rounded-xl p-10 bg-muted/10">
                    <FolderKanban className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-sm text-muted-foreground mb-4">You haven't created any projects yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full bg-card">
                                <CardHeader>
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {project.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        ID: <span className="font-mono">{project.id.slice(-6)}</span>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}