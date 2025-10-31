import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminSidebar } from "@/components/management-portal/AdminSidebar";
import { AdminHeader } from "@/components/management-portal/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, BookOpen, Users, CheckCircle, XCircle } from "lucide-react";
import { adminApi, DashboardStats } from "@/services/api/adminApi";
import { toast } from "sonner";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  currency?: string;
}

interface RecentCourse {
  title: string;
  status: string;
  categories: {
    name: string;
  } | null;
}

interface RecentOrder {
  id: string;
  courses: {
    price: number;
  } | null;
  profiles: {
    full_name: string;
  } | null;
}

interface ChartData {
  month: string;
  year: number;
  orderAmount: number;
  orderCount: number;
}

interface CategoryChartData {
  name: string;
  value: number;
}

interface TopCourseData {
  title: string;
  enrollment_count: number;
}

interface NewUserChartData {
  month: string;
  year: number;
  userCount: number;
}

interface PriceDistributionData {
  name: string;
  count: number;
}

interface MonthlyData {
  enrolled_at: string;
  courses: {
    price: number;
  }
}

interface UserData {
  created_at: string;
}

const StatCard = ({ title, value, icon, currency }: StatCardProps) => (
  <Card className= "bg-card border-border" >
  <CardContent className="flex items-center justify-between p-6" >
    <div>
    <p className="text-sm font-medium text-muted-foreground" > { title } </p>
      < p className = "text-2xl font-bold text-foreground" >
        { currency && currency}{ value }
</p>
  </div>
  < div className = "p-3 bg-primary/10 rounded-lg" >
    <div className="text-primary" > { icon } </div>
      </div>
      </CardContent>
      </Card>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await adminApi.dashboard.getStats();
        setStats(dashboardData);
        
        // Set recent courses from popular courses
        if (dashboardData.popular_courses) {
          setRecentCourses(dashboardData.popular_courses.slice(0, 5));
        }
        
        // Set recent orders from recent enrollments
        if (dashboardData.recent_enrollments) {
          setRecentOrders(dashboardData.recent_enrollments.slice(0, 5));
        }
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data', {
          description: error.response?.data?.message || error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
            count: 0,
          };
        });

        prices.forEach(price => {
          const binIndex = Math.floor(price / binSize);
          if (bins[binIndex]) {
            bins[binIndex].count++;
          }
        });

        setPriceDistributionData(bins);

      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <SidebarProvider>
    <div className= "min-h-screen flex w-full bg-background" >
    <AdminSidebar />

    < main className = "flex-1 p-6" >
      <AdminHeader title="Dashboard" />

        {/* KPI Cards */ }
        < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
        {
          statsLoading?(
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <Card key= { i } className = "bg-card border-border" >
              <CardContent className="flex items-center justify-between p-6" >
            <div className="space-y-2" >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            </div>
            < Skeleton className = "h-12 w-12 rounded-lg" />
            </CardContent>
            </Card>
            ))
            ) : error?(
              <div className = "col-span-full text-center py-8" >
                <p className="text-destructive"> Error loading statistics: { error } </p>
                  </div>
            ) : (
    <>
    <StatCard
                  title= "Today's Orders"
  value = { stats.todayOrders }
  icon = {< DollarSign className = "w-6 h-6" />}
                />
  < StatCard
title = "This Week's Orders"
value = { stats.thisWeekOrders }
icon = {< DollarSign className = "w-6 h-6" />}
                />
  < StatCard
title = "This Month's Orders"
value = { stats.thisMonthOrders }
icon = {< DollarSign className = "w-6 h-6" />}
                />
  < StatCard
title = "Total Orders"
value = { stats.totalOrders }
icon = {< ShoppingCart className = "w-6 h-6" />}
                />
  < StatCard
title = "Total Revenue"
value = { stats.totalRevenue.toLocaleString() }
icon = {< DollarSign className = "w-6 h-6" />}
currency = "₦"
  />
  <StatCard
                  title="Total Courses"
value = { stats.totalCourses }
icon = {< BookOpen className = "w-6 h-6" />}
                />
  < StatCard
title = "Pending Courses"
value = { stats.pendingCourses }
icon = {< BookOpen className = "w-6 h-6" />}
                />
  < StatCard
title = "Rejected Courses"
value = { stats.rejectedCourses }
icon = {< XCircle className = "w-6 h-6" />}
                />
  < StatCard
title = "Active Courses"
value = { stats.activeCourses }
icon = {< CheckCircle className = "w-6 h-6" />}
                />
  </>
            )}
</div>

{/* Main Chart */ }
<Card className="mb-8" >
  <CardHeader>
  <div className="flex items-center justify-between" >
    <div>
    <CardTitle className="text-lg font-semibold text-foreground" > Order Analytics </CardTitle>
      </div>
      < div className = "flex items-center space-x-4 text-sm" >
        <div className="flex items-center" >
          <div className="w-3 h-3 bg-blue-500 rounded mr-2" > </div>
            < span > Order Amount(₦) </span>
              </div>
              < div className = "flex items-center" >
                <div className="w-3 h-3 bg-pink-500 rounded mr-2" > </div>
                  < span > Order Count </span>
                    </div>
                    </div>
                    </div>
                    </CardHeader>
                    < CardContent >
                    <div className="h-96" >
                      <ResponsiveContainer width="100%" height = "100%" >
                        <ComposedChart data={ chartData }>
                          <CartesianGrid strokeDasharray="3 3" className = "stroke-muted" />
                            <XAxis 
                      dataKey="month"
axisLine = { false}
tickLine = { false}
className = "text-muted-foreground"
tick = {{ fontSize: 12 }}
                    />
  < YAxis
yAxisId = "left"
axisLine = { false}
tickLine = { false}
className = "text-muted-foreground"
tick = {{ fontSize: 12 }}
domain = { [0, 'dataMax + 20000']}
  />
  <YAxis 
                      yAxisId="right"
orientation = "right"
axisLine = { false}
tickLine = { false}
className = "text-muted-foreground"
tick = {{ fontSize: 12 }}
domain = { [0, 'dataMax + 5']}
  />
  <Tooltip 
                      contentStyle={
  {
    backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: 'hsl(var(--foreground))'
  }
}
                    />
  < Bar
yAxisId = "left"
dataKey = "orderAmount"
fill = "hsl(var(--primary))"
radius = { [4, 4, 0, 0]}
  />
  <Line 
                      yAxisId="right"
type = "monotone"
dataKey = "orderCount"
stroke = "#ec4899"
strokeWidth = { 3}
dot = {{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
activeDot = {{ r: 8, fill: '#ec4899' }}
                    />
  </ComposedChart>
  </ResponsiveContainer>
  </div>
  </CardContent>
  </Card>

  < div className = "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" >
    {/* Course Categories Pie Chart */ }
    < Card className = "lg:col-span-1" >
      <CardHeader>
      <CardTitle className="text-lg font-semibold text-foreground" > Course Categories </CardTitle>
        </CardHeader>
        < CardContent >
        <div className="h-80" >
          <ResponsiveContainer width="100%" height = "100%" >
            <PieChart>
            <Pie
                        data={ categoryChartData }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "value"
nameKey = "name"
label = {({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
{
  categoryChartData.map((entry, index) => (
    <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                        ))}
</Pie>
  < Tooltip />
  <Legend />
  </PieChart>
  </ResponsiveContainer>
  </div>
  </CardContent>
  </Card>

{/* Top 5 Courses Bar Chart */ }
<Card className="lg:col-span-2" >
  <CardHeader>
  <CardTitle className="text-lg font-semibold text-foreground" > Top 5 Enrolled Courses </CardTitle>
    </CardHeader>
    < CardContent >
    <div className="h-80" >
      <ResponsiveContainer width="100%" height = "100%" >
        <BarChart data={ topCoursesData } layout = "vertical" >
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
              <YAxis dataKey="title" type = "category" width = { 150} />
                <Tooltip />
                < Legend />
                <Bar dataKey="enrollment_count" fill = "#8884d8" />
                  </BarChart>
                  </ResponsiveContainer>
                  </div>
                  </CardContent>
                  </Card>
                  </div>

                  < div className = "grid grid-cols-1 lg:grid-cols-2 gap-6" >
                    {/* Recent Courses */ }
                    < Card >
                    <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground" > Recent Courses </CardTitle>
                      </CardHeader>
                      < CardContent >
                      <div className="space-y-4" >
                        <div className="flex justify-between text-sm font-medium text-muted-foreground border-b pb-2" >
                          <span>COURSE </span>
                          < span > STATUS </span>
                          </div>
{
  recentCourses.map((course, index) => (
    <div key= { index } className = "flex justify-between items-center" >
    <span className="text-sm text-primary hover:underline cursor-pointer" >
    { course.title }
    </span>
  < span className = {`px-2 py-1 text-xs rounded-full ${course.status === 'PUBLISHED' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : course.status === 'DRAFT' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'}`}>
    { course.status }
    </span>
    </div>
                  ))}
</div>
  </CardContent>
  </Card>

{/* Recent Orders */ }
<Card>
  <CardHeader>
  <CardTitle className="text-lg font-semibold text-foreground" > Recent Orders </CardTitle>
    </CardHeader>
    < CardContent >
    <div className="space-y-4" >
      <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground border-b pb-2" >
        <span>INVOICE </span>
        < span > USER </span>
        < span > AMOUNT </span>
        </div>
{
  recentOrders.map((order, index) => (
    <div key= { index } className = "grid grid-cols-3 text-sm" >
    <span className="text-primary hover:underline cursor-pointer" >
    { order.id.slice(0, 8) }
    </span>
  < span className = "text-foreground" > { order.profiles.full_name } </span>
  < span className = "text-foreground" >₦{ order.courses.price.toLocaleString() } </span>
  </div>
  ))
}
</div>
  </CardContent>
  </Card>
  </div>

{/* New User Growth Chart */ }
<Card className="mt-8" >
  <CardHeader>
  <CardTitle className="text-lg font-semibold text-foreground" > New User Growth </CardTitle>
    </CardHeader>
    < CardContent >
    <div className="h-80" >
      <ResponsiveContainer width="100%" height = "100%" >
        <LineChart data={ newUserChartData }>
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
              <YAxis />
              < Tooltip />
              <Legend />
              < Line type = "monotone" dataKey = "userCount" stroke = "#8884d8" activeDot = {{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
                </div>
                </CardContent>
                </Card>

{/* Course Price Distribution Histogram */ }
<Card className="mt-8" >
  <CardHeader>
  <CardTitle className="text-lg font-semibold text-foreground" > Course Price Distribution </CardTitle>
    </CardHeader>
    < CardContent >
    <div className="h-80" >
      <ResponsiveContainer width="100%" height = "100%" >
        <BarChart data={ priceDistributionData }>
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
              <YAxis />
              < Tooltip />
              <Legend />
              < Bar dataKey = "count" fill = "#82ca9d" />
                </BarChart>
                </ResponsiveContainer>
                </div>
                </CardContent>
                </Card>
                </main>
                </div>
                </SidebarProvider>
  );
}