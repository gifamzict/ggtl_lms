import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, BookOpen, Users, CheckCircle, XCircle } from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const chartData = [
  { month: "Jan", orderAmount: 0, orderCount: 0 },
  { month: "Feb", orderAmount: 0, orderCount: 0 },
  { month: "Mar", orderAmount: 0, orderCount: 0 },
  { month: "Apr", orderAmount: 0, orderCount: 0 },
  { month: "May", orderAmount: 100000, orderCount: 4 },
  { month: "Jun", orderAmount: 0, orderCount: 0 },
  { month: "Jul", orderAmount: 0, orderCount: 0 },
  { month: "Aug", orderAmount: 0, orderCount: 0 },
  { month: "Sep", orderAmount: 0, orderCount: 0 },
  { month: "Oct", orderAmount: 0, orderCount: 0 },
  { month: "Nov", orderAmount: 0, orderCount: 0 },
  { month: "Dec", orderAmount: 0, orderCount: 0 },
];

const recentCourses = [
  { title: "Intro to Flutter", status: "Approved" },
  { title: "E-commerce Strategies for Small Business...", status: "Approved" },
  { title: "Songwriting Basics: Crafting Melodies", status: "Approved" },
  { title: "Introduction to Financial Markets", status: "Approved" },
  { title: "Remote Work Productivity: Tips and Tools", status: "Approved" },
];

const recentBlogs = [
  { title: "Innovative Strategies for Engaging Students", status: "Active" },
  { title: "Understanding Educational Psychology", status: "Active" },
  { title: "Parental Involvement: Building Strong Home", status: "Active" },
  { title: "Effective Evaluation Techniques for Teachers", status: "Active" },
  { title: "Promoting Health and Wellbeing in Schools", status: "Active" },
];

const recentOrders = [
  { invoice: "#6818c509990f5", user: "Adeshile Oluwaseyi Samson", amount: "303 NGN" },
  { invoice: "#6818c3f7d7a78", user: "Adeshile Oluwaseyi Samson", amount: "100000 NGN" },
  { invoice: "#6818c2d7b4f9c", user: "Jhon Deo", amount: "0 NGN" },
  { invoice: "#6818c2d6e6d32", user: "Jhon Deo", amount: "108 NGN" },
  { invoice: "#673858371360", user: "Jhon Deo", amount: "124 USD" },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  currency?: string;
}

const StatCard = ({ title, value, icon, currency }: StatCardProps) => (
  <Card className="bg-card border-border">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">
          {currency && currency}{value}
        </p>
      </div>
      <div className="p-3 bg-primary/10 rounded-lg">
        <div className="text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { stats, loading: statsLoading, error } = useAdminStats();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <AdminHeader title="Dashboard" />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-destructive">Error loading statistics: {error}</p>
              </div>
            ) : (
              <>
                <StatCard
                  title="Today's Orders"
                  value={stats.todayOrders}
                  icon={<DollarSign className="w-6 h-6" />}
                />
                <StatCard
                  title="This Week's Orders"
                  value={stats.thisWeekOrders}
                  icon={<DollarSign className="w-6 h-6" />}
                />
                <StatCard
                  title="This Month's Orders"
                  value={stats.thisMonthOrders}
                  icon={<DollarSign className="w-6 h-6" />}
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={<ShoppingCart className="w-6 h-6" />}
                />
                <StatCard
                  title="Total Courses"
                  value={stats.totalCourses}
                  icon={<BookOpen className="w-6 h-6" />}
                />
                <StatCard
                  title="Pending Courses"
                  value={stats.pendingCourses}
                  icon={<BookOpen className="w-6 h-6" />}
                />
                <StatCard
                  title="Rejected Courses"
                  value={stats.rejectedCourses}
                  icon={<XCircle className="w-6 h-6" />}
                />
                <StatCard
                  title="Active Courses"
                  value={stats.activeCourses}
                  icon={<CheckCircle className="w-6 h-6" />}
                />
              </>
            )}
          </div>

          {/* Main Chart */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Order Analytics</CardTitle>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span>Order Amount (₦)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-pink-500 rounded mr-2"></div>
                    <span>Order Count</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      domain={[0, 120000]}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      domain={[0, 4.5]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="orderAmount" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orderCount" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#ec4899' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Items Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground border-b pb-2">
                    <span>COURSE</span>
                    <span>STATUS</span>
                  </div>
                  {recentCourses.map((course, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-primary hover:underline cursor-pointer">
                        {course.title}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full">
                        {course.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Blogs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Blogs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground border-b pb-2">
                    <span>TITLE</span>
                    <span>STATUS</span>
                  </div>
                  {recentBlogs.map((blog, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-primary hover:underline cursor-pointer">
                        {blog.title}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full">
                        {blog.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground border-b pb-2">
                    <span>INVOICE</span>
                    <span>USER</span>
                    <span>AMOUNT</span>
                  </div>
                  {recentOrders.map((order, index) => (
                    <div key={index} className="grid grid-cols-3 text-sm">
                      <span className="text-primary hover:underline cursor-pointer">
                        {order.invoice}
                      </span>
                      <span className="text-foreground">{order.user}</span>
                      <span className="text-foreground">{order.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}