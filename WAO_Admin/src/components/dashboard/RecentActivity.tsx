import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  orders: any[];
}

const RecentActivity = ({ orders }: RecentActivityProps) => {
  // Generate activities from real order data
  const activities = orders.slice(0, 5).map((order, index) => ({
    id: order.id,
    type: 'order',
    title: order.status === 'paid' ? 'Payment verified' : 'New order received',
    description: `${order.name} - ${order.event || 'Event Registration'}`,
    time: new Date(order.created_at || Date.now() - (index * 60000)).toLocaleString(),
    icon: ShoppingCart,
    color: order.status === 'paid' ? 'text-green-600' : 'text-blue-600',
    bgColor: order.status === 'paid' ? 'bg-green-50' : 'bg-blue-50'
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest actions and updates across the system
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
              <div className="flex-shrink-0">
                {activity.type === 'order' && (
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                )}
                {activity.type === 'payment' && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Verified
                  </Badge>
                )}
                {activity.type === 'feedback' && (
                  <Badge variant="outline" className="text-xs text-orange-600">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Recent orders will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;