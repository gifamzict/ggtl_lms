import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { AuthModal } from '@/components/auth/AuthModal';
import { ThemeProvider } from './components/ThemeProvider';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import CoursesManagement from "./pages/admin/CoursesManagement";
import CourseForm from "./pages/admin/CourseForm";
import CourseCategories from "./pages/admin/CourseCategories";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import ManageAdmins from "./pages/admin/ManageAdmins";
import Students from "./pages/admin/Students";
import AdminProfile from "./pages/admin/AdminProfile";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/courses" element={<CoursesManagement />} />
                  <Route path="/admin/courses/new" element={<CourseForm />} />
                  <Route path="/admin/courses/edit/:id" element={<CourseForm />} />
                  <Route path="/admin/course-categories" element={<CourseCategories />} />
                  <Route path="/admin/manage-admins" element={<ManageAdmins />} />
                  <Route path="/admin/students" element={<Students />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <AuthModal />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
