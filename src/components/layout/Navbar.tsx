import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, ChevronDown } from 'lucide-react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { UserNav } from './UserNav';

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

export function Navbar() {
  const { user, openAuthModal } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

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
              <SheetTitle>GGTL</SheetTitle>
              <SheetDescription>
                Expand your knowledge with our courses
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link 
                to="/categories" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard/my-learning" 
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Learning
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/teach" 
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Teach on GGTL
                  </Link>
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
            GGTL
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 flex-1 max-w-4xl mx-8">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ backgroundColor: 'hsl(var(--accent))' }}
                  className="px-2 py-1.5 text-sm cursor-pointer rounded-md"
                >
                  <Link to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {category}
                  </Link>
                </motion.div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
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
              <Link 
                to="/dashboard/my-learning"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Learning
              </Link>
              <UserNav user={user} />
            </>
          ) : (
            <>
              <Link 
                to="/teach"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Teach on GGTL
              </Link>
              <Button 
                variant="outline" 
                onClick={openAuthModal}
                className="hover:scale-105 transition-transform"
              >
                Log In
              </Button>
              <Button 
                onClick={openAuthModal}
                className="hover:scale-105 transition-transform"
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