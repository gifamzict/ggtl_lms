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

  const stats = [
    {
      label: 'Total Students',
      value: dashboardData?.stats?.total_students || 0,
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
    },
    {
      label: 'Active Courses',
      value: dashboardData?.stats?.total_courses || 0,
      change: '+3',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
    },
    {
      label: 'Total Enrollments',
      value: dashboardData?.stats?.total_enrollments || 0,
      change: '+8',
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: darkMode ? 'bg-green-900/30' : 'bg-green-50'
    },
    {
      label: 'Revenue',
      value: `₦${(dashboardData?.stats?.total_revenue || 0).toLocaleString()}`,
      change: '+18.2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: darkMode ? 'bg-orange-900/30' : 'bg-orange-50'
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
className = {`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === tabName
  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
  : darkMode
    ? 'text-gray-300 hover:bg-gray-700/50'
    : 'text-gray-600 hover:bg-gray-100'
  }`}
    >
  <Icon className={ `w-5 h-5 transition-transform duration-300 ${activeTab === tabName ? '' : 'group-hover:scale-110'}` } />
{ sidebarOpen && <span className="font-medium" > { label } </span> }
</button>
  );

if (loading) {
  return (
    <div className= {`flex h-screen items-center justify-center transition-colors duration-500 ${darkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`
}>
  <div className="text-center" >
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" > </div>
      < p className = { darkMode? 'text-gray-300': 'text-gray-600' } > Loading dashboard...</p>
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
    } ${!sidebarOpen && 'justify-center'}`
}>
  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg" >
    { user?.full_name?.substring(0, 2).toUpperCase() || 'AD' }
    </div>
{
  sidebarOpen && (
    <div className="flex-1 overflow-hidden" >
      <p className={ `font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}` }> { user?.full_name || 'Admin User'
} </p>
  < p className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> { user?.email || 'admin@ggtl.tech'}</p>
    </div>
            )}
</div>
  </div>
  </div>

{/* Main Content */ }
<div className="flex-1 flex flex-col overflow-hidden" >
  {/* Header */ }
  < header className = {`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } shadow-sm border-b px-6 py-4 transition-colors duration-500`}>
      <div className="flex items-center justify-between" >
        <div className="flex items-center gap-4" >
          <button
                onClick={ () => setSidebarOpen(!sidebarOpen) }
className = {`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  }`}
              >
  <Menu className={ `w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}` } />
    </button>
    < div >
    <h2 className={ `text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }> Dashboard </h2>
      < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> Welcome back, { user?.full_name || 'Admin'}</p>
        </div>
        </div>

        < div className = "flex items-center gap-4" >
          {/* Dark Mode Toggle */ }
          < button
onClick = { toggleDarkMode }
className = {`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
  }`}
              >
  {
    darkMode?(
                  <Sun className = "w-6 h-6 text-yellow-400" />
                ): (
        <Moon className = "w-6 h-6 text-gray-600" />
                )}
</button>

{/* Search */ }
<div className="relative group" >
  <Search className={
  `absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-500'
    }`
} />
  < input
type = "text"
placeholder = "Search..."
className = {`pl-10 pr-4 py-2 w-64 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode
  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
  : 'bg-white border-gray-200 text-gray-800'
  } border`}
                />
  </div>

{/* Notifications */ }
<button className={
  `relative p-2 rounded-xl transition-all duration-300 hover:scale-110 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
    }`
}>
  <Bell className={ `w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}` } />
{
  notifications > 0 && (
    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse" >
      { notifications }
      </span>
                )
}
</button>

{/* Logout */ }
<button 
                onClick={ handleLogout }
className = "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
  >
  <LogOut className="w-4 h-4" />
    <span className="font-medium" > Logout </span>
      </button>
      </div>
      </div>
      </header>

{/* Content Area */ }
<main className="flex-1 overflow-y-auto p-6" >
  { activeTab === 'overview' && (
    <div className="space-y-6" >
      {/* Stats Grid */ }
      < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
      {
        stats.map((stat, index) => (
          <div
                    key= { index }
                    className = {`${darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
style = {{ transitionDelay: `${index * 100}ms` }}
                  >
  <div className="flex items-center justify-between mb-4" >
    <div className={ `p-3 rounded-xl ${stat.bgColor}` }>
      <stat.icon className={ `w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}` } />
        </div>
        < span className = "text-sm font-semibold text-green-500 bg-green-500/10 px-3 py-1 rounded-full" >
          { stat.change }
          </span>
          </div>
          < h3 className = {`text-3xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}> { stat.value } </h3>
            < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> { stat.label } </p>
              </div>
                ))}
</div>

{/* Recent Activity */ }
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
  {/* Recent Courses */ }
  < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6" >
        <h3 className={ `text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
          <BookOpen className="w-5 h-5 text-purple-500" />
            Popular Courses
              </h3>
              < button
onClick = {() => navigate('/management-portal/courses')}
className = "text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 group"
  >
  View All
    < ChevronRight className = "w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      </div>
      < div className = "space-y-4" >
      {
        recentCourses.length > 0 ? recentCourses.map((course, index) => (
          <div
                        key= { course.id }
                        className = {`p-4 border rounded-xl transition-all duration-300 cursor-pointer group ${darkMode
            ? 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'
            : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
            }`}
style = {{ animationDelay: `${index * 50}ms` }}
                      >
  <div className="flex items-start justify-between" >
    <div className="flex-1" >
      <h4 className={
  `font-semibold group-hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'
    }`
}>
  { course.title }
  </h4>
  < p className = {`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    by { course.instructor?.full_name || 'Instructor' }
</p>
  < div className = "flex items-center gap-4 mt-2" >
    <span className={ `text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}` }>
      <Users className="w-3 h-3" />
        { course.total_enrollments || 0 }
        </span>
        < span className = {`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Award className="w-3 h-3" />
            { course.average_rating || 'N/A' }
            </span>
            </div>
            </div>
            < span
className = {`text-xs px-3 py-1 rounded-full font-medium ${course.status === 'PUBLISHED'
  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
  : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
  }`}
                          >
  { course.status }
  </span>
  </div>
  </div>
                    )) : (
  <p className= {`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    No courses available
      </p>
                    )}
</div>
  </div>

{/* Recent Enrollments */ }
<div className={
  `${darkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300`
}>
  <div className="flex items-center justify-between mb-6" >
    <h3 className={ `text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
      <Users className="w-5 h-5 text-blue-500" />
        Recent Enrollments
          </h3>
          < button
onClick = {() => navigate('/management-portal/students')}
className = "text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 group"
  >
  View All
    < ChevronRight className = "w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      </div>
      < div className = "space-y-4" >
      {
        recentUsers.length > 0 ? recentUsers.map((enrollment, index) => (
          <div
                        key= { enrollment.id }
                        className = {`flex items-center gap-4 p-4 border rounded-xl transition-all duration-300 cursor-pointer group ${darkMode
            ? 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'
            : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
            }`}
style = {{ animationDelay: `${index * 50}ms` }}
                      >
  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform" >
    { enrollment.user?.name?.substring(0, 2).toUpperCase() || 'ST' }
    </div>
    < div className = "flex-1" >
      <h4 className={
  `font-semibold group-hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'
    }`
}>
  { enrollment.user?.name || 'Student' }
  </h4>
  < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    { enrollment.course?.title || 'Course' }
    </p>
    </div>
    < div className = "text-right" >
      <span className={
  `text-xs px-3 py-1 rounded-full font-medium ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
    }`
}>
  { enrollment.status || 'ACTIVE' }
  </span>
  < p className = {`text-xs mt-1 flex items-center gap-1 justify-end ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
    <Clock className="w-3 h-3" />
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
