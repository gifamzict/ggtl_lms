import { useState } from "react";
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
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  status: "active" | "pending" | "rejected";
  isActive: boolean;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React Development",
    instructor: "John Doe",
    price: 25000,
    status: "active",
    isActive: true,
  },
  {
    id: "2", 
    title: "Advanced JavaScript Concepts",
    instructor: "Jane Smith",
    price: 35000,
    status: "pending",
    isActive: false,
  },
  {
    id: "3",
    title: "Python for Data Science",
    instructor: "Mike Johnson",
    price: 40000,
    status: "active",
    isActive: true,
  },
  {
    id: "4",
    title: "Flutter Mobile Development",
    instructor: "Sarah Wilson",
    price: 30000,
    status: "rejected",
    isActive: false,
  },
];

const columnHelper = createColumnHelper<Course>();

export default function CoursesManagement() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockCourses);
  const [globalFilter, setGlobalFilter] = useState("");

  const handleStatusToggle = (courseId: string, newStatus: boolean) => {
    setData(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, isActive: newStatus, status: newStatus ? "active" : "pending" as const }
          : course
      )
    );
  };

  const handleDelete = (courseId: string) => {
    setData(prev => prev.filter(course => course.id !== courseId));
  };

  const columns: ColumnDef<Course, any>[] = [
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
          status === "active" ? "default" : 
          status === "pending" ? "secondary" : 
          "destructive";
        
        return (
          <Badge variant={variant} className="capitalize">
            {status}
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
                onClick={() => navigate(`/admin/courses/edit/${row.original.id}`)}
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Courses Management</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button onClick={() => navigate("/admin/courses/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Button>
            </div>
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
                    {table.getRowModel().rows?.length ? (
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
                          No results.
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