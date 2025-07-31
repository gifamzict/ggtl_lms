import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, ChevronDown, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const categories = [
  'Development',
  'Business', 
  'Design',
  'Marketing',
  'IT & Software',
  'Personal Development',
  'Photography',
  'Music',
  'Health & Fitness',
  'Teaching & Academics'
];

export function PublicNavbar() {
  const { user, openAuthModal, setUser, setSession } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>GIFAMZ</SheetTitle>
              <SheetDescription>
                Expand your knowledge with our courses
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link 
                to="/courses" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link 
                to="/categories" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/student/dashboard" 
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      openAuthModal();
                      setIsOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => {
                      openAuthModal();
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold text-primary"
          >
            GIFAMZ
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 flex-1 max-w-4xl mx-8">
          {/* Main Nav Links */}
          <nav className="flex items-center space-x-6">
            <Link 
              to="/courses"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Courses
            </Link>
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-sm font-medium">
                  Category
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            
            <Link 
              to="/blogs"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Blogs
            </Link>
            
            <Link 
              to="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative ml-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for anything"
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* Cart Icon */}
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/student/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={openAuthModal}
                className="hover:scale-105 transition-transform"
              >
                Log In
              </Button>
              <Button 
                onClick={openAuthModal}
                className="hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}