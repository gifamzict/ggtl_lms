import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash2, Search } from "lucide-react";
import { AdminSidebar } from "@/components/management-portal/AdminSidebar";
import { AdminHeader } from "@/components/management-portal/AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { adminApi } from "@/services/api/adminApi";

interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
}


const columnHelper = createColumnHelper<Course>();

export default function CoursesManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState<Course[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses from Laravel API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      const courses = await adminApi.courses.getAll();

      if (courses) {
        const transformedCourses: Course[] = courses.map(course => ({
          id: course.id,
          title: course.title,
          instructor: course.instructor?.full_name || course.instructor?.name || 'Unknown',
          price: parseFloat(course.price) || 0,
          status: course.status,
          isActive: course.status === 'PUBLISHED'
        }));
        setData(transformedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusToggle = async (courseId: number, newStatus: boolean) => {
    try {
      const status = newStatus ? 'PUBLISHED' : 'DRAFT';
      await adminApi.courses.update(courseId, { status });

      setData(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, isActive: newStatus, status }
            : course
        )
      );
      toast.success(`Course ${newStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated lessons.')) {
      return;
    }

    try {
      await adminApi.courses.delete(courseId);

      setData(prev => prev.filter(course => course.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const columns: ColumnDef<Course>[] = [
    columnHelper.accessor("title", {
      header: "Course Title",
      cell: (info) => (
        <div className="font-medium text-foreground">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("instructor", {
      header: "Instructor",
      cell: (info) => (
        <div className="text-muted-foreground">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <div className="font-semibold text-foreground">
          ₦{info.getValue().toLocaleString()}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const variant = 
          status === "PUBLISHED" ? "default" : 
          status === "DRAFT" ? "secondary" : 
          "destructive";
        
        return (
          <Badge variant={variant} className="capitalize">
            {status.toLowerCase()}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.isActive}
            onCheckedChange={(checked) => handleStatusToggle(row.original.id, checked)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem 
                onClick={() => navigate(`/management-portal/courses/edit/${row.original.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <AdminHeader title="Courses Management" />
          
          {/* Quick Actions */}
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => {
                navigate("/management-portal/courses/new");
                // Refresh courses when coming back
                setTimeout(() => fetchCourses(), 100);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Courses</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search courses..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Loading courses...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No courses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getRowModel().rows.length} of {data.length} courses
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}