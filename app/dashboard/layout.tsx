import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UserButton } from "@/components/user-button"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {ThemeToggle} from "@/components/theme-toggle";
export default async function DashboardLayout({children,}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-14 border-b flex items-center px-4 shrink-0 bg-background">
                        <SidebarTrigger />
                    <div className="ml-auto flex items-center gap-4">
                        <ThemeToggle />
                        <UserButton user={session.user} />
                    </div>
                </header>
                <div className="p-6 flex-1 overflow-auto bg-muted/20">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}