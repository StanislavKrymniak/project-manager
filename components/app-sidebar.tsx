import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, CheckSquare, FolderGit2 } from "lucide-react"

// Navigation items
const items = [
    { title: "Overview", url: "/dashboard", icon: Home },
    { title: "My Tasks", url: "/dashboard/tasks", icon: CheckSquare },
    { title: "Projects", url: "/dashboard/projects", icon: FolderGit2 },
]

export function AppSidebar() {
    return (
        <Sidebar className="!w-64">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>SyncBoard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton render={<a href={item.url} />}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}