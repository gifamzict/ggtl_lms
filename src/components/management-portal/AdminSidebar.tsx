import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  Award,
  ShoppingCart,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  Phone,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/management-portal",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    icon: UserCheck,
    items: [
      { title: "Manage Admins", url: "/management-portal/manage-admins" },
      { title: "Students", url: "/management-portal/students" },
    ],
  },
  {
    title: "Course Management",
    icon: BookOpen,
    items: [
      { title: "Courses", url: "/management-portal/courses" },
      { title: "Course Categories", url: "/management-portal/course-categories" },
    ],
  },
  {
    title: "Orders",
    url: "/management-portal/orders",
    icon: ShoppingCart,
  },
  {
    title: "Payment Settings",
    url: "/management-portal/payment-settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/management-portal/profile",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const collapsed = !open;
  const [openItems, setOpenItems] = useState<string[]>(["Course Management"]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    if (path === "/management-portal") {
      return location.pathname === "/management-portal";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded"></div>
          {!collapsed && <span className="font-semibold text-lg">GGTL Admin</span>}
        </div>
        <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible 
                    open={openItems.includes(item.title)}
                    onOpenChange={() => toggleItem(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent">
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                        {!collapsed && (
                          openItems.includes(item.title) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className={`ml-6 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent ${
                                isActive(subItem.url) ? 'bg-sidebar-accent text-sidebar-foreground' : ''
                              }`}
                            >
                              <NavLink to={subItem.url}>
                                {!collapsed && <span>{subItem.title}</span>}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton 
                    asChild
                    className={`text-sidebar-foreground hover:bg-sidebar-accent ${
                      isActive(item.url!) ? 'bg-sidebar-accent text-sidebar-primary-foreground' : ''
                    }`}
                  >
                    <NavLink to={item.url!}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}