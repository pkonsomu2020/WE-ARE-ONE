import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  Download,
  TrendingUp,
  Activity,
  FileText,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';

// Helper function to safely format dates
const formatDate = (dateString: any): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

interface AdminMetrics {
  admin_profile_id: number;
  full_name: string;
  email: string;
  role: string;
  documents_uploaded: number;
  feedback_responses: number;
  events_created: number;
  documents_downloaded: number;
  events_updated: number;
  events_deleted: number;
  total_actions: number;
  last_activity: string;
}

type TrendDatum = {
  date: string;
  total_actions: number;
  documents_uploaded: number;
  feedback_responses: number;
  events_created: number;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://we-are-one-api.onrender.com';

const AdminAnalyticsPage = () => {
  const [metrics, setMetrics] = useState<AdminMetrics[]>([]);
  const [trends, setTrends] = useState<TrendDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminMetrics | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [selectedAdmin, setSelectedAdmin] = useState<'all' | string>('all');

  const adminOptions = useMemo(() => (
    metrics.map(admin => ({
      label: admin.full_name,
      value: String(admin.admin_profile_id)
    }))
  ), [metrics]);

  useEffect(() => {
    loadAnalytics().catch((error) => console.error('Failed to load analytics:', error));
  }, [dateRange, selectedAdmin]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wao_admin_token');
      // Add 1 day buffer to endDate to catch activities that happened "now"
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + 1);
      const endDate = endDateObj.toISOString();
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - parseInt(dateRange, 10));
      const startDate = startDateObj.toISOString();

      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : { 'x-admin-key': '3090375ecb2326add24b37c7fd9b5fce4959c766677cdd4fd32eb67fa383db44' };

      // Get current admin profile to check role
      const profileResponse = await fetch(
        `${API_BASE_URL}/api/feedback/admin-profile`,
        { headers, credentials: 'include' }
      );
      const profileJson = await profileResponse.json();
      
      if (profileJson.success && profileJson.data) {
        const profile = profileJson.data;
        const isSuper = profile.role === 'Super Admin' || profile.email === 'admin@weareone.co.ke';
        setIsSuperAdmin(isSuper);
        
        // Use the new real analytics API
        const overviewResponse = await fetch(
          `${API_BASE_URL}/api/real-analytics/overview?startDate=${startDate}&endDate=${endDate}`,
          { headers, credentials: 'include' }
        );
        const overviewJson = await overviewResponse.json();
        
        if (overviewJson.success) {
          const metricsData = overviewJson.data.metrics || [];
          
          if (isSuper) {
            // Super Admin: Show all admins
            setMetrics(metricsData);
            setCurrentAdmin(metricsData.find((m: AdminMetrics) => m.email === profile.email) || null);
          } else {
            // Regular Admin: Show only their own data
            const ownMetrics = metricsData.find((m: AdminMetrics) => m.email === profile.email);
            if (ownMetrics) {
              setMetrics([ownMetrics]);
              setCurrentAdmin(ownMetrics);
              setSelectedAdmin(String(ownMetrics.admin_profile_id));
            }
          }
        }
      }

      const trendsUrl = new URL(`${API_BASE_URL}/api/real-analytics/trends`);
      trendsUrl.searchParams.set('startDate', startDate);
      trendsUrl.searchParams.set('endDate', endDate);
      if (selectedAdmin !== 'all') {
        trendsUrl.searchParams.set('adminProfileId', selectedAdmin);
      }

      const trendsResponse = await fetch(trendsUrl.toString(), { headers, credentials: 'include' });
      const trendsJson = await trendsResponse.json();
      if (trendsJson.success) {
        setTrends(trendsJson.data.trends || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('wao_admin_token');
      const endDate = new Date().toISOString();
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - parseInt(dateRange, 10));
      const startDate = startDateObj.toISOString();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : { 'x-admin-key': '3090375ecb2326add24b37c7fd9b5fce4959c766677cdd4fd32eb67fa383db44' };

      const response = await fetch(
        `${API_BASE_URL}/api/real-analytics/export?type=overview&startDate=${startDate}&endDate=${endDate}`,
        { headers, credentials: 'include' }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin_analytics_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export analytics:', error);
      alert('Failed to export analytics CSV');
    }
  };

  const totalMetrics = metrics.reduce((acc, admin) => ({
    documents_uploaded: acc.documents_uploaded + (admin.documents_uploaded || 0),
    feedback_responses: acc.feedback_responses + (admin.feedback_responses || 0),
    events_created: acc.events_created + (admin.events_created || 0),
    total_actions: acc.total_actions + (admin.total_actions || 0)
  }), {
    documents_uploaded: 0,
    feedback_responses: 0,
    events_created: 0,
    total_actions: 0
  });

  const selectedAdminMetrics = useMemo(() => (
    selectedAdmin === 'all' ? null : metrics.find(admin => String(admin.admin_profile_id) === selectedAdmin)
  ), [selectedAdmin, metrics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            {isSuperAdmin ? 'Admin Analytics - All Admins' : 'My Analytics'}
          </h1>
          <p className="text-gray-600">
            {isSuperAdmin 
              ? 'Monitor all admin activity, performance metrics, and engagement trends.' 
              : 'Track your activity, performance metrics, and engagement trends.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Only show admin selector for Super Admin */}
          {isSuperAdmin && (
            <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Admins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                {adminOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMetrics.total_actions}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documents Uploaded</p>
                  <p className="text-2xl font-bold text-green-600">{totalMetrics.documents_uploaded}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Feedback Responses</p>
                  <p className="text-2xl font-bold text-purple-600">{totalMetrics.feedback_responses}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Events Created</p>
                  <p className="text-2xl font-bold text-orange-600">{totalMetrics.events_created}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Activity Trends</CardTitle>
          <CardDescription>Daily admin activity across documents, feedback, and events</CardDescription>
        </CardHeader>
        <CardContent>
          {trends.length === 0 ? (
            <p className="text-sm text-gray-500">No activity recorded for the selected range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_actions" stroke="#2563EB" name="Total Actions" strokeWidth={2} />
                <Line type="monotone" dataKey="documents_uploaded" stroke="#10B981" name="Documents" strokeWidth={2} />
                <Line type="monotone" dataKey="feedback_responses" stroke="#8B5CF6" name="Feedback" strokeWidth={2} />
                <Line type="monotone" dataKey="events_created" stroke="#F59E0B" name="Events" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Only show admin performance table for Super Admin */}
      {isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Performance</CardTitle>
            <CardDescription>Breakdown of actions completed by all {metrics.length} admins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4">Admin</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4 text-right">Documents</th>
                  <th className="py-2 pr-4 text-right">Feedback</th>
                  <th className="py-2 pr-4 text-right">Events</th>
                  <th className="py-2 pr-4 text-right">Total Actions</th>
                  <th className="py-2 pr-4">Last Activity</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(admin => (
                  <tr key={admin.admin_profile_id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <div>
                        <p className="font-medium text-gray-900">{admin.full_name}</p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline">{admin.role || 'Admin'}</Badge>
                    </td>
                    <td className="py-2 pr-4 text-right">{admin.documents_uploaded}</td>
                    <td className="py-2 pr-4 text-right">{admin.feedback_responses}</td>
                    <td className="py-2 pr-4 text-right">{admin.events_created}</td>
                    <td className="py-2 pr-4 text-right font-semibold">{admin.total_actions}</td>
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      {formatDate(admin.last_activity)}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <Button
                        size="sm"
                        variant={selectedAdmin === String(admin.admin_profile_id) ? 'default' : 'outline'}
                        onClick={() => setSelectedAdmin(String(admin.admin_profile_id))}
                      >
                        View Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}

      {selectedAdminMetrics && isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Detail</CardTitle>
            <CardDescription>Detailed metrics for {selectedAdminMetrics.full_name}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{selectedAdminMetrics.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Role</p>
              <Badge>{selectedAdminMetrics.role || 'Admin'}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Documents Uploaded</p>
              <p className="font-semibold text-lg text-gray-900">{selectedAdminMetrics.documents_uploaded}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Feedback Responses</p>
              <p className="font-semibold text-lg text-gray-900">{selectedAdminMetrics.feedback_responses}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Events Created</p>
              <p className="font-semibold text-lg text-gray-900">{selectedAdminMetrics.events_created}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Total Activity</p>
              <p className="font-semibold text-lg text-gray-900">{selectedAdminMetrics.total_actions}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Last Activity</p>
              <p className="text-sm text-gray-700">{formatDate(selectedAdminMetrics.last_activity)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Recognition</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Award className="w-4 h-4 text-amber-500" />
                Top contributor in {dateRange}-day window
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
