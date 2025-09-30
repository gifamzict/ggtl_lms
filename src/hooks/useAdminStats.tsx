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

      // Fetch admin stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats').single();
      if (statsError) {
        console.error('Error fetching get_admin_stats:', statsError);
        throw new Error('Failed to fetch main statistics.');
      }

      setStats({
        todayOrders: statsData.today_orders || 0,
        thisWeekOrders: statsData.this_week_orders || 0,
        thisMonthOrders: statsData.this_month_orders || 0,
        totalOrders: statsData.total_orders || 0,
        totalCourses: statsData.total_courses || 0,
        pendingCourses: statsData.pending_courses || 0,
        rejectedCourses: statsData.rejected_courses || 0,
        activeCourses: statsData.active_courses || 0,
        totalRevenue: statsData.total_revenue || 0,
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