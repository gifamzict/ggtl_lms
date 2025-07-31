import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { requireAdminAuth } from '@/middleware/adminAuth';

interface AdminStats {
  todayOrders: number;
  thisWeekOrders: number;
  thisMonthOrders: number;
  totalOrders: number;
  totalCourses: number;
  pendingCourses: number;
  rejectedCourses: number;
  activeCourses: number;
  totalRevenue: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    todayOrders: 0,
    thisWeekOrders: 0,
    thisMonthOrders: 0,
    totalOrders: 0,
    totalCourses: 0,
    pendingCourses: 0,
    rejectedCourses: 0,
    activeCourses: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify admin permissions
      await requireAdminAuth();

      // Get current date boundaries
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch courses stats
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('status');

      if (coursesError) throw coursesError;

      // Fetch enrollments for order statistics
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('enrolled_at');

      if (enrollmentsError) throw enrollmentsError;

      // Calculate course statistics
      const totalCourses = courses?.length || 0;
      const pendingCourses = courses?.filter(c => c.status === 'DRAFT').length || 0;
      const rejectedCourses = courses?.filter(c => c.status === 'ARCHIVED').length || 0;
      const activeCourses = courses?.filter(c => c.status === 'PUBLISHED').length || 0;

      // Calculate enrollment/order statistics
      const totalOrders = enrollments?.length || 0;
      
      const todayOrders = enrollments?.filter(e => {
        const enrollDate = new Date(e.enrolled_at);
        return enrollDate >= today;
      }).length || 0;

      const thisWeekOrders = enrollments?.filter(e => {
        const enrollDate = new Date(e.enrolled_at);
        return enrollDate >= weekStart;
      }).length || 0;

      const thisMonthOrders = enrollments?.filter(e => {
        const enrollDate = new Date(e.enrolled_at);
        return enrollDate >= monthStart;
      }).length || 0;

      setStats({
        todayOrders,
        thisWeekOrders,
        thisMonthOrders,
        totalOrders,
        totalCourses,
        pendingCourses,
        rejectedCourses,
        activeCourses,
        totalRevenue: 0, // Will need payment/order table to calculate real revenue
      });

    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}