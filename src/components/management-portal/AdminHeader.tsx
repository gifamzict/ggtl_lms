import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user, userProfile, signOut, loading } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/management-portal/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-10 w-20 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8 bg-card border-b border-border px-6 py-4 -mx-6 -mt-6 mb-6">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {!user ? (
          <Button asChild>
            <Link to="/management-portal/login">
              <User className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto px-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userProfile?.full_name ? getInitials(userProfile.full_name) : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm font-medium">
                  {userProfile?.full_name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userProfile?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Role: {userProfile?.role || 'ADMIN'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}