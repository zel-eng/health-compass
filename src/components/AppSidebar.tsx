import { LayoutDashboard, Users, FileText, Bell, Settings, BarChart3, UserCog, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { stats } from "@/lib/mock-data";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Health Records", url: "/health-records", icon: FileText },
  { title: "Alerts & Reminders", url: "/alerts", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Users", url: "/users", icon: UserCog },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        <div className={`flex items-center gap-2.5 px-4 pb-6 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-semibold text-foreground tracking-tight">MedFlow</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-primary/8 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.url === "/alerts" && stats.activeAlerts > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-xs">
                          {stats.activeAlerts}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60">Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} activeClassName="bg-primary/8 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{stats.totalPatients} patients</span>
            <span className="text-destructive font-medium">{stats.activeAlerts} alerts</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
