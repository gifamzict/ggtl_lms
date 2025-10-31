import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, ChevronDown, ShoppingCart, User, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { useCartStore } from '@/store/cartStore';
import { adminApi } from '@/services/api/adminApi';
import { toast } from 'sonner';
import { CartButton } from '@/components/cart/CartButton';
interface Category {
  id: number;
  name: string;
  slug: string;
}
export function PublicNavbar() {
  // Supabase auth (existing)
  const {
    user: supabaseUser,
    signOut: supabaseSignOut,
    isAdmin,
    isSuperAdmin
  } = useAuth();

  // Laravel auth (new)
  const {
    user: laravelUser,
    isAuthenticated: isLaravelAuthenticated,
    logout: laravelLogout
  } = useLaravelAuth();

  // Prioritize Laravel auth when available
  const user = laravelUser || supabaseUser;
  const isAuthenticated = isLaravelAuthenticated || !!supabaseUser;

  const { openAuthModal } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminApi.categories.getAll();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Silently fail - categories will just be empty
      }
    };
    fetchCategories();
  }, []);
  const handleSignOut = async () => {
    if (isLaravelAuthenticated) {
      laravelLogout();
    } else {
      await supabaseSignOut();
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';

    // For Laravel users
    if (laravelUser) {
      return laravelUser.full_name || laravelUser.name || laravelUser.email;
    }

    // For Supabase users (existing logic)
    return (user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  return <motion.header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" initial = {{
    y: -100
  }
} animate = {{
  y: 0
}} transition = {{
  duration: 0.3
}}>
  <div className="container flex h-16 items-center justify-between px-4" >
    {/* Mobile Menu Button */ }
    < Sheet open = { isOpen } onOpenChange = { setIsOpen } >
      <SheetTrigger asChild className = "md:hidden" >
        <Button variant="ghost" size = "icon" >
          <Menu className="h-5 w-5" />
            <span className="sr-only" > Toggle menu </span>
              </Button>
              </SheetTrigger>
              < SheetContent side = "left" className = "w-80" >
                <SheetHeader>
                <SheetTitle>GIFAMZ </SheetTitle>
                <SheetDescription>
              Expand your knowledge with our courses
  </SheetDescription>
  </SheetHeader>
  < div className = "grid gap-4 py-4" >
    <Link to="/" className = "text-sm font-medium hover:text-primary transition-colors" onClick = {() => setIsOpen(false)}>
      Home
      </Link>
      < Link to = "/about-us" className = "text-sm font-medium hover:text-primary transition-colors" onClick = {() => setIsOpen(false)}>
        About Us
          </Link>
          < Link to = "/contact-us" className = "text-sm font-medium hover:text-primary transition-colors" onClick = {() => setIsOpen(false)}>
            Contact Us
              </Link>
{
  isAuthenticated ? <>
    <Link to="/student/dashboard" className = "text-sm font-medium hover:text-primary transition-colors" onClick = {() => setIsOpen(false)
}>
  Dashboard
  </Link>
  < Button variant = "outline" onClick = {() => {
  handleSignOut();
  setIsOpen(false);
}}>
  Sign Out
    </Button>
    </> : <>
    < Button variant = "outline" onClick = {() => {
  openAuthModal();
  setIsOpen(false);
}}>
  Log In
    </Button>
    < Button onClick = {() => {
  openAuthModal();
  setIsOpen(false);
}}>
  Sign Up
    </Button>
    </>}
</div>
  </SheetContent>
  </Sheet>

{/* Logo */ }
<Link to="/" className = "flex items-center space-x-2" >
  <motion.div whileHover={
  {
    scale: 1.05
  }
} whileTap = {{
  scale: 0.95
}} className = "text-2xl font-bold text-primary" >
  GIFAMZ
  </motion.div>
  </Link>

{/* Desktop Navigation */ }
<div className="hidden md:flex items-center space-x-6 flex-1 max-w-4xl mx-8" >
  {/* Main Nav Links */ }
  < nav className = "flex items-center space-x-6" >
    <Link to="/" className = "text-sm font-medium hover:text-primary transition-colors" >
      Home
      </Link>

{/* Categories Dropdown */ }
<DropdownMenu>
  <DropdownMenuTrigger asChild >
  <Button variant="ghost" className = "gap-1 text-sm font-medium" >
    Category
    < ChevronDown className = "h-4 w-4" />
      </Button>
      </DropdownMenuTrigger>
      < DropdownMenuContent align = "start" className = "w-56 bg-background border shadow-lg z-50" >
      {
        categories.length > 0 ? categories.map(category => <DropdownMenuItem key={ category.id } asChild >
          <Link to={`/courses?category=${category.id}`} className = "flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors" >
            { category.name }
            </Link>
            </DropdownMenuItem>) : <DropdownMenuItem disabled >
              <span className="text-muted-foreground" > Loading categories...</span>
                </DropdownMenuItem>}
</DropdownMenuContent>
  </DropdownMenu>

  < Link to = "/about-us" className = "text-sm font-medium hover:text-primary transition-colors" >
    About Us
      </Link>



      < Link to = "/contact-us" className = "text-sm font-medium hover:text-primary transition-colors" >
        Contact Us
          </Link>
          </nav>

{/* Search Bar */ }
<div className="flex-1 max-w-md relative ml-6" >
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input placeholder="Search for anything" className = "pl-10 w-full" />
      </div>
      </div>

{/* Right Side Actions */ }
<div className="hidden md:flex items-center space-x-4" >
{
  isAuthenticated?<>
          {/* Cart Button */ }
          < CartButton />

  {/* User Menu */ }
  < DropdownMenu >
  <DropdownMenuTrigger asChild >
  <Button variant="ghost" className = "relative h-8 w-8 rounded-full" >
    <Avatar className="h-8 w-8" >
      <AvatarImage src={ laravelUser?.avatar_url || (user as any)?.user_metadata?.avatar_url } alt = { getUserDisplayName() } />
        <AvatarFallback className="bg-primary text-primary-foreground" >
          { getUserInitials() }
          </AvatarFallback>
          </Avatar>
          </Button>
          </DropdownMenuTrigger>
          < DropdownMenuContent className = "w-56" align = "end" forceMount >
            <div className="flex items-center justify-start gap-2 p-2" >
              <div className="flex flex-col space-y-1 leading-none" >
                <p className="font-medium" > { getUserDisplayName() } </p>
                  < p className = "w-[200px] truncate text-sm text-muted-foreground" >
                    { laravelUser?.email || user?.email}
</p>
  </div>
  </div>
  < DropdownMenuSeparator />
  <DropdownMenuItem asChild >
  <Link to="/student/dashboard" className = "flex items-center" >
    <User className="mr-2 h-4 w-4" />
      Dashboard
      </Link>
      </DropdownMenuItem>

{/* Admin Access */ }
{
  (isAdmin() || isSuperAdmin()) && (
    <>
    <DropdownMenuSeparator />
    < DropdownMenuItem asChild >
      <Link to="/management-portal" className = "flex items-center text-primary" >
        <Shield className="mr-2 h-4 w-4" />
          Admin Panel
            </Link>
            </DropdownMenuItem>
            </>
              )
}

{/* Debug Access - Remove in production */ }
<DropdownMenuSeparator />


  < DropdownMenuItem asChild >

    </DropdownMenuItem>

    < DropdownMenuSeparator />
    <DropdownMenuItem onClick={ handleSignOut }>
      Log out
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        </> : <>
        < Button variant = "outline" onClick = { openAuthModal } className = "hover:scale-105 transition-transform" >
          Log In
            </Button>
            < Button onClick = { openAuthModal } className = "hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90" >
              Sign Up
                </Button>
                </>}
</div>
  </div>
  </motion.header>;
}