import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, BookOpen, TrendingUp, LogOut, Menu, Bell, Search, UserCheck, Award, Clock, ChevronRight, Moon, Sun, ShoppingCart, CreditCard, CheckCircle, AlertCircle, Eye, Edit } from 'lucide-react';
import { adminApi, DashboardStats } from '@/services/api/adminApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import CoursesManagement from '../components/admin/CoursesManagement';
import StudentManagement from '../components/admin/StudentManagement';
import OrdersManagement from '../components/admin/OrdersManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import PaymentsManagement from '../components/admin/PaymentsManagement';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState(3);
  const [animateCards, setAnimateCards] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    setAnimateCards(true);
    fetchDashboardData();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      const data = await adminApi.dashboard.getStats();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Helper function to format currency properly
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format percentage change
  const formatPercentageChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  const stats = [
    {
      label: 'Total Students',
      value: dashboardData?.stats?.total_students || 0,
      change: formatPercentageChange(dashboardData?.stats?.students_change || 0),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: darkMode ? 'bg-blue-900/30' : 'bg-blue-50',
      changePositive: (dashboardData?.stats?.students_change || 0) >= 0
    },
    {
      label: 'Active Courses',
      value: dashboardData?.stats?.total_courses || 0,
      change: null, // Courses don't typically have monthly changes
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: darkMode ? 'bg-purple-900/30' : 'bg-purple-50',
      changePositive: true
    },
    {
      label: 'Total Enrollments',
      value: dashboardData?.stats?.total_enrollments || 0,
      change: formatPercentageChange(dashboardData?.stats?.enrollments_change || 0),
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: darkMode ? 'bg-green-900/30' : 'bg-green-50',
      changePositive: (dashboardData?.stats?.enrollments_change || 0) >= 0
    },
    {
      label: 'Revenue',
      value: formatCurrency(dashboardData?.stats?.total_revenue || 0),
      change: formatPercentageChange(dashboardData?.stats?.revenue_change || 0),
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: darkMode ? 'bg-orange-900/30' : 'bg-orange-50',
      changePositive: (dashboardData?.stats?.revenue_change || 0) >= 0
    },
  ];

  const recentCourses = dashboardData?.top_courses?.slice(0, 4) || [];
  const recentUsers = dashboardData?.recent_enrollments?.slice(0, 4) || [];

  const NavItem = ({ icon: Icon, label, tabName, route }: any) => (
    <button
      onClick= {() => {
    if (route) {
      navigate(route);
    } else {
      setActiveTab(tabName);
    }
  }
}
className = {`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group relative overflow-hidden ${activeTab === tabName
  ? darkMode
    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
  : darkMode
    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`}
    >
  <Icon className={
  `w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeTab === tabName ? 'scale-110' : 'group-hover:scale-105'
    }`
} />
{
  sidebarOpen && (
    <span className="font-medium transition-all duration-300" > { label } </span>
      )
}
{
  activeTab === tabName && sidebarOpen && (
    <ChevronRight className="w-4 h-4 ml-auto" />
      )
}
</button>
  );

if (loading) {
  return (
    <div className= {`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`
}>
  <div className="text-center" >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" > </div>
      < p className = {`mt-4 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Loading dashboard...
</p>
  </div>
  </div>
    );
  }

return (
  <div className= {`flex h-screen transition-colors duration-500 overflow-hidden ${darkMode
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Sidebar */ }
      < div
className = {`${sidebarOpen ? 'w-64' : 'w-20'
  } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  } shadow-2xl transition-all duration-500 ease-in-out flex flex-col border-r`}
      >
  {/* Logo */ }
  < div className = {`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
    <div className="flex items-center gap-3" >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg" >
        <BarChart3 className="w-6 h-6 text-white" />
          </div>
{
  sidebarOpen && (
    <div className="overflow-hidden" >
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" >
        GGTL Admin
          </h1>
          < p className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
}>
  Control Panel
    </p>
    </div>
            )}
</div>
  </div>

{/* Navigation */ }
<nav className="flex-1 p-4 space-y-2 overflow-y-auto" >
  <NavItem icon={ BarChart3 } label = "Overview" tabName = "overview" />
    <NavItem icon={ BookOpen } label = "Courses" tabName = "courses" />
      <NavItem icon={ Users } label = "Students" tabName = "students" />
        <NavItem icon={ ShoppingCart } label = "Orders" tabName = "orders" />
          <NavItem icon={ CreditCard } label = "Payments" tabName = "payments" />
            <NavItem icon={ Award } label = "Categories" tabName = "categories" />
              </nav>

{/* User Profile */ }
<div className={ `p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}` }>
  <div className={
  `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
    }`
}>
  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm" >
    { user?.name?.charAt(0) || 'A'}
</div>
{
  sidebarOpen && (
    <div className="flex-1 overflow-hidden" >
      <p className={
    `text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'
      }`
  }>
    { user?.name || 'Admin User'
}
</p>
  < p className = {`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>
      { user?.email || 'admin@example.com'}
</p>
  </div>
            )}
</div>

  < div className = "flex gap-2 mt-3" >
    <button
              onClick={ toggleDarkMode }
className = {`flex-1 p-2 rounded-lg transition-colors ${darkMode
  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
  }`}
title = { darkMode? 'Switch to Light Mode': 'Switch to Dark Mode' }
  >
  { darkMode?<Sun className = "w-4 h-4 mx-auto" /> : <Moon className="w-4 h-4 mx-auto" />}
</button>
  < button
onClick = { handleLogout }
className = "flex-1 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
title = "Logout"
  >
  <LogOut className="w-4 h-4 mx-auto" />
    </button>
    </div>
    </div>
    </div>

{/* Main Content */ }
<div className="flex-1 flex flex-col overflow-hidden" >
  {/* Top Bar */ }
  < header className = {`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
    <div className="flex items-center justify-between px-6 py-4" >
      <div className="flex items-center gap-4" >
        <button
                onClick={ () => setSidebarOpen(!sidebarOpen) }
className = {`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
  }`}
              >
  <Menu className="w-5 h-5" />
    </button>

    < div className = "hidden md:flex items-center gap-2" >
      <Search className={ `w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}` } />
        < input
type = "text"
placeholder = "Search..."
className = {`px-3 py-2 rounded-lg border-none outline-none bg-transparent ${darkMode ? 'text-gray-200 placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'
  }`}
                />
  </div>
  </div>

  < div className = "flex items-center gap-4" >
    <button className={
  `relative p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
    }`
}>
  <Bell className="w-5 h-5" />
    { notifications > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" >
        { notifications }
        </span>
                )}
</button>
  </div>
  </div>
  </header>

{/* Content Area */ }
<main className="flex-1 overflow-y-auto p-6" >
  { activeTab === 'overview' && (
    <div className="space-y-6" >
      {/* Stats Cards */ }
      < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
      {
        stats.map((stat, index) => (
          <div
                    key= { index }
                    className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } hover:-translate-y-1 group`}
style = {{ transitionDelay: `${index * 100}ms` }}
                  >
  <div className="flex items-center justify-between" >
    <div>
    <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
      { stat.label }
      </p>
      < p className = {`text-3xl font-bold mt-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        { stat.value }
        </p>
{
  stat.change && (
    <p className={
      `text-sm mt-1 font-medium ${stat.changePositive
        ? 'text-green-600'
        : 'text-red-600'
      }`
  }>
    { stat.change }
    </p>
          )
}
</div>
  < div className = {`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
    <stat.icon className="w-6 h-6 text-white" />
      </div>
      </div>
      </div>
                ))}
</div>

{/* Recent Activity */ }
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
  {/* Recent Courses */ }
  < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
    <div className="flex items-center justify-between mb-6" >
      <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
        Top Courses
          </h3>
          < Clock className = {`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            < div className = "space-y-4" >
            {
              recentCourses.length > 0 ? recentCourses.map((course: any, index: number) => (
                <div key= { index } className = {`flex items-center gap-4 p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`} >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md" >
                <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  < div className = "flex-1" >
                    <h4 className={ `font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                      { course.title }
                      </h4>
                      < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        { course.total_enrollments || 0 } enrollments
                          </p>
                          </div>
                          < div className = "text-right" >
                            <p className={ `font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                            ₦{ (course.price || 0).toLocaleString() }
</p>
  </div>
  </div>
                    )) : (
  <p className= {`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    No courses available
      </p>
                    )}
</div>
  </div>

{/* Recent Users */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg` }>
  <div className="flex items-center justify-between mb-6" >
    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
      Recent Enrollments
        </h3>
        < Users className = {`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          < div className = "space-y-4" >
          {
            recentUsers.length > 0 ? recentUsers.map((enrollment: any, index: number) => (
              <div key= { index } className = {`flex items-center gap-4 p-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`} >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm" >
              { enrollment.user?.name?.charAt(0) || 'U' }
              </div>
              < div className = "flex-1" >
                <h4 className={ `font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }>
                  { enrollment.user?.name || 'Unknown User' }
                  </h4>
                  < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    { enrollment.course?.title || 'Course' }
                    </p>
                    </div>
                    < div className = "text-right" >
                      <p className={ `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                        { new Date(enrollment.enrolled_at).toLocaleDateString() }
                        </p>
                        </div>
                        </div>
                    )) : (
  <p className= {`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    No recent enrollments
      </p>
                    )}
</div>
  </div>
  </div>
  </div>
          )}

{
  activeTab === 'courses' && (
    <CoursesManagement darkMode={ darkMode } dashboardData = { dashboardData } />
          )
}

{
  activeTab === 'students' && (
    <StudentManagement darkMode={ darkMode } dashboardData = { dashboardData } />
          )
}

{
  activeTab === 'orders' && (
    <OrdersManagement darkMode={ darkMode } dashboardData = { dashboardData } />
          )
}

{
  activeTab === 'categories' && (
    <CategoryManagement darkMode={ darkMode } dashboardData = { dashboardData } />
          )
}

{
  activeTab === 'payments' && (
    <PaymentsManagement darkMode={ darkMode } dashboardData = { dashboardData } />
          )
}
</main>
  </div>
  </div>
  );
}