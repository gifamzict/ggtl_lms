import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, User, BookOpen, ShoppingCart, MessageSquare, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { toast } from "sonner";
const navigationItems = [{
  title: "Profile",
  url: "/student/profile",
  icon: User
}, {
  title: "Enrolled Courses",
  url: "/student/courses",
  icon: BookOpen
}];
export function StudentSidebar() {
  const {
    state
  } = useSidebar();
  const navigate = useNavigate();
  const {
    setUser,
    setSession
  } = useAuthStore();
  const handleSignOut = async () => {
    try {
      const {
        error
      } = await authService.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  const getNavClassName = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-primary text-primary-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  return <Sidebar className={ state === "collapsed" ? "w-14" : "w-60" } collapsible = "icon" >
    <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="bg-gray-600" >
        <SidebarGroup>
        <SidebarGroupContent>
        <SidebarMenu>
        {
          navigationItems.map(item => <SidebarMenuItem key={ item.title } >
            <SidebarMenuButton asChild >
            <NavLink to={ item.url } className = { getNavClassName } >
            <item.icon className="mr-2 h-4 w-4 bg-zinc-600" />
            { state !== "collapsed" && <span className="text-slate-50" > { item.title } </span>}
        </NavLink>
        </SidebarMenuButton>
        </SidebarMenuItem>)
}

<SidebarMenuItem>
  <SidebarMenuButton onClick={ handleSignOut } className = "text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground" >
    <LogOut className="mr-2 h-4 w-4" />
      { state !== "collapsed" && <span className="text-slate-50" > Sign Out </span>}
</SidebarMenuButton>
  </SidebarMenuItem>
  </SidebarMenu>
  </SidebarGroupContent>
  </SidebarGroup>
  </SidebarContent>
  </Sidebar>;
}
