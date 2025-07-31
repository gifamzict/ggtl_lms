import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import { AdminAuthGuard } from '@/components/auth/AdminAuthGuard';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { useLocation } from 'react-router-dom';
import { AuthModal } from '@/components/auth/AuthModal';
import { ThemeProvider } from './components/ThemeProvider';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesManagement from "./pages/admin/CoursesManagement";
import CourseForm from "./pages/admin/CourseForm";
import CourseCategories from "./pages/admin/CourseCategories";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import ManageAdmins from "./pages/admin/ManageAdmins";
import Students from "./pages/admin/Students";
import AdminProfile from "./pages/admin/AdminProfile";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      {!isAdminRoute && <PublicNavbar />}
      <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  
                  {/* Public Admin Login/Signup (not protected) */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/signup" element={<AdminSignup />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin/*" element={
                    <AdminAuthGuard>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="courses" element={<CoursesManagement />} />
                        <Route path="courses/new" element={<CourseForm />} />
                        <Route path="courses/edit/:id" element={<CourseForm />} />
                        <Route path="course-categories" element={<CourseCategories />} />
                        <Route path="manage-admins" element={<ManageAdmins />} />
                        <Route path="students" element={<Students />} />
                        <Route path="profile" element={<AdminProfile />} />
                      </Routes>
                    </AdminAuthGuard>
                  } />
                  
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
        </main>
        <AuthModal />
      </div>
    );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
