import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface Order {
    id: string;
    course_title: string;
    user_name: string;
    amount: number;
    enrolled_at: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('enrollments')
                    .select(`
                        id,
                        enrolled_at,
                        courses ( title, price ),
                        profiles ( full_name )
                    `)
                    .order('enrolled_at', { ascending: false });

                if (error) {
                    throw error;
                }

                const formattedOrders: Order[] = data.map((order: any) => ({
                    id: order.id,
                    course_title: order.courses.title,
                    user_name: order.profiles.full_name,
                    amount: order.courses.price,
                    enrolled_at: new Date(order.enrolled_at).toLocaleDateString(),
                }));

                setOrders(formattedOrders);
            } catch (error) {
                toast.error(error.message || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1">
                    <AdminHeader />
                    <main className="p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <p>Loading orders...</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Course</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders.length > 0 ? (
                                                orders.map(order => (
                                                    <TableRow key={order.id}>
                                                        <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                                                        <TableCell>{order.course_title}</TableCell>
                                                        <TableCell>{order.user_name}</TableCell>
                                                        <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                                                        <TableCell>{order.enrolled_at}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminOrders;