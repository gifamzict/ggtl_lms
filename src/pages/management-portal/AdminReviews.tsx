import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';
import { AdminHeader } from '@/components/management-portal/AdminHeader';
import { AdminSidebar } from '@/components/management-portal/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface Review {
    id: string;
    course_title: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface FetchedReview {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    courses: {
        title: string;
    } | null;
    profiles: {
        full_name: string;
    } | null;
}

const AdminReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select(`
                        id,
                        rating,
                        comment,
                        created_at,
                        courses ( title ),
                        profiles ( full_name )
                    `)
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                const formattedReviews: Review[] = (data as FetchedReview[]).map((review) => ({
                    id: review.id,
                    course_title: review.courses?.title || 'N/A',
                    user_name: review.profiles?.full_name || 'N/A',
                    rating: review.rating,
                    comment: review.comment,
                    created_at: new Date(review.created_at).toLocaleDateString(),
                }));

                setReviews(formattedReviews);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch reviews.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex-1">
                    <AdminHeader title="Reviews" />
                    <main className="p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <p>Loading reviews...</p>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Course</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Comment</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reviews.length > 0 ? (
                                                reviews.map(review => (
                                                    <TableRow key={review.id}>
                                                        <TableCell>{review.course_title}</TableCell>
                                                        <TableCell>{review.user_name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{review.comment}</TableCell>
                                                        <TableCell>{review.created_at}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">No reviews found.</TableCell>
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

export default AdminReviews;