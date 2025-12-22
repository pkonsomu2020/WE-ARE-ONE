import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  CheckCircle,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  Eye,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import StatsCards from '@/components/dashboard/StatsCards';
import MissionVision from '@/components/dashboard/MissionVision';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    activeEvents: 0,
    pendingComplaints: 0,
    upcomingMeetings: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load real statistics from API
      try {
        const statsResponse = await api.getDashboardStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        // Keep stats at 0 if API not available
      }

      // Load recent orders from existing API
      try {
        const ordersResponse = await api.listPayments();
        if (ordersResponse.success && ordersResponse.payments) {
          const recentOrdersData = ordersResponse.payments.slice(0, 5).map((payment: any) => ({
            id: payment.id,
            name: payment.full_name,
            event: payment.event_id || 'Event Registration',
            status: payment.status === 'pending_verification' ? 'pending' : payment.status,
            amount: payment.amount
          }));
          setRecentOrders(recentOrdersData);
        }
      } catch (error) {
        // Keep orders empty if API not available
      }
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to WAO Admin Portal</h1>
            <p className="text-orange-100">
              Manage your organization efficiently with our comprehensive admin dashboard
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <img src="/wao_favicon.jpg" alt="WAO" className="w-10 h-10 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Mission & Vision */}
      <MissionVision />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity orders={recentOrders} />
        </div>
      </div>

      {/* Recent Orders Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders Overview</CardTitle>
            <CardDescription>Latest payment verifications and order status</CardDescription>
          </div>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All Orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.name}</p>
                    <p className="text-sm text-gray-500">{order.event}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">KSh {order.amount.toLocaleString()}</span>
                  <Badge
                    variant={order.status === 'paid' ? 'default' : 'secondary'}
                    className={order.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;