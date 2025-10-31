import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Award,
  MessageSquare,
  LogOut,
  Settings,
  GraduationCap,
  BarChart3,
  Heart,
  Bell,
  HelpCircle,
  Target
} from "lucide-react";
import { useLaravelAuth } from "@/store/laravelAuthStore";
import { toast } from "sonner";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Stats"
  },
  {
    title: "My Courses",
    url: "/student/courses",
    icon: BookOpen,
    description: "Enrolled Courses"
  },
  {
    title: "Progress",
    url: "/student/progress",
    icon: BarChart3,
    description: "Track Learning"
  },
  {
    title: "Certificates",
    url: "/student/certificates",
    icon: Award,
    description: "Earned Certificates"
  },
  {
    title: "Profile",
    url: "/student/profile",
    icon: User,
    description: "Account Settings"
  }
];

const quickActions = [
  {
    title: "Goals",
    url: "/student/goals",
    icon: Target,
    description: "Learning Goals"
  },
  {
    title: "Favorites",
    url: "/student/favorites",
    icon: Heart,
    description: "Saved Courses"
  },
  {
    title: "Notifications",
    url: "/student/notifications",
    icon: Bell,
    description: "Updates & News"
  },
  {
    title: "Help",
    url: "/student/help",
    icon: HelpCircle,
    description: "Support Center"
  }
];

export function StudentSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useLaravelAuth();

  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      logout();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg"
      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200";

  return (
    <Sidebar 
      className= {`${state === "collapsed" ? "w-16" : "w-72"} transition-all duration-300 border-r border-gray-200 bg-white`
}
collapsible = "icon"
  >
  <div className="h-full flex flex-col" >
    {/* Header */ }
    < div className = "p-4 border-b border-gray-100" >
      <div className="flex items-center justify-between" >
        { state !== "collapsed" && (
          <div className="flex items-center space-x-3" >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" >
              <GraduationCap className="h-6 w-6 text-white" />
                </div>
                < div >
                <h2 className="font-bold text-gray-900" > GGTL Portal </h2>
                  < p className = "text-xs text-gray-500" > Student Dashboard </p>
                    </div>
                    </div>
            )}
<SidebarTrigger className="hover:bg-gray-100 rounded-lg p-2 transition-colors" />
  </div>
  </div>

{/* User Profile Section */ }
{
  state !== "collapsed" && (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100" >
      <div className="flex items-center space-x-3" >
        <Avatar className="h-12 w-12 ring-2 ring-white shadow-md" >
          <AvatarImage src={ user?.avatar_url } />
            < AvatarFallback className = "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold" >
              { getUserInitials() }
              </AvatarFallback>
              </Avatar>
              < div className = "flex-1 min-w-0" >
                <p className="font-semibold text-gray-900 truncate" > { getUserDisplayName() } </p>
                  < p className = "text-sm text-gray-600 truncate" > { user?.email } </p>
                    < Badge variant = "secondary" className = "mt-1 text-xs" >
                      Student
                      </Badge>
                      </div>
                      </div>
                      </div>
        )
}

<SidebarContent className="flex-1 overflow-y-auto" >
  {/* Main Navigation */ }
  < SidebarGroup >
  <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2" >
    { state !== "collapsed" ? "Main Menu" : ""}
</SidebarGroupLabel>
  < SidebarGroupContent >
  <SidebarMenu className="space-y-1 px-2" >
  {
    navigationItems.map(item => (
      <SidebarMenuItem key= { item.title } >
      <SidebarMenuButton asChild className = "h-12 rounded-lg" >
      <NavLink to={ item.url } className = { getNavClassName } >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      { state !== "collapsed" && (
      <div className="ml-3" >
    <span className="font-medium" > { item.title } </span>
    < p className = "text-xs opacity-75" > { item.description } </p>
    </div>
    )
  }
    </NavLink>
    </SidebarMenuButton>
    </SidebarMenuItem>
                ))}
</SidebarMenu>
  </SidebarGroupContent>
  </SidebarGroup>

  < Separator className = "mx-2 my-4" />

    {/* Quick Actions */ }
    < SidebarGroup >
    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2" >
      { state !== "collapsed" ? "Quick Actions" : ""}
</SidebarGroupLabel>
  < SidebarGroupContent >
  <SidebarMenu className="space-y-1 px-2" >
  {
    quickActions.map(item => (
      <SidebarMenuItem key= { item.title } >
      <SidebarMenuButton asChild className = "h-10 rounded-lg" >
      <NavLink to={ item.url } className = "text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      { state !== "collapsed" && (
      <div className="ml-3" >
    <span className="text-sm" > { item.title } </span>
    < p className = "text-xs text-gray-500" > { item.description } </p>
    </div>
    )
  }
    </NavLink>
    </SidebarMenuButton>
    </SidebarMenuItem>
                ))}
</SidebarMenu>
  </SidebarGroupContent>
  </SidebarGroup>
  </SidebarContent>

{/* Footer Actions */ }
<div className="p-4 border-t border-gray-100 bg-gray-50" >
  <SidebarMenu>
  <SidebarMenuItem>
  <SidebarMenuButton 
                onClick={ handleSignOut }
className = "w-full h-12 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
  >
  <LogOut className="h-5 w-5 flex-shrink-0" />
    { state !== "collapsed" && (
      <div className="ml-3 text-left" >
        <span>Sign Out </span>
          < p className = "text-xs opacity-75" > Logout securely </p>
            </div>
                )}
</SidebarMenuButton>
  </SidebarMenuItem>
  </SidebarMenu>
  </div>
  </div>
  </Sidebar>
  );
}
