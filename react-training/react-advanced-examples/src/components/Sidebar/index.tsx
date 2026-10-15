import { CircleAlert, LayoutDashboard, BookCheck, Settings, BadgeHelp, Logs, LogOut } from "lucide-react"
import { Sidebar as UISidebar, SidebarHeader as UISidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/Hooks/Auth";
import SidebarHeader from "../SidebarHeader";
import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vital Task",
    path: "/dashboard/vital-tasks",
    icon: CircleAlert,
  },
  {
    title: "My Task",
    path: "/dashboard/tasks",
    icon: BookCheck,
  },
  {
    title: "Task Categories",
    path: "/dashboard/task-categories",
    icon: Logs,
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help",
    path: "/dashboard/help",
    icon: BadgeHelp,
  },
]

const Sidebar = () => {
  const auth = useAuth();
  const location = useLocation();

  const activeItemPath = useMemo(() => {
    return items
      .filter(item =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
      )
      .sort((a, b) => b.path.length - a.path.length)[0]?.path
  }, [location.pathname])

  return (
    <UISidebar variant="inset" className="p-0">
      <UISidebarHeader className="relative mb-5">
        <SidebarHeader />
      </UISidebarHeader>
      <SidebarContent className="bg-sidebar-primary text-sidebar-primary-foreground mt-13 pt-24">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.path === activeItemPath} className="h-15 hover:text-destructive pl-6">
                    <NavLink to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-primary text-sidebar-primary-foreground pb-7">
        <SidebarMenuButton className="h-15 hover:text-destructive pl-6" onClick={auth.logout}>
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </UISidebar>
  )
}

export default Sidebar
