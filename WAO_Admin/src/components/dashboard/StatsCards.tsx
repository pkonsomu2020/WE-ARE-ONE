import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    paidOrders: number;
    activeEvents: number;
    pendingComplaints: number;
    upcomingMeetings: number;
    totalRevenue: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Paid Orders',
      value: stats.paidOrders,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingComplaints,
      icon: MessageSquare,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '-2',
      changeType: 'negative'
    },
    {
      title: 'Upcoming Meetings',
      value: stats.upcomingMeetings,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+1',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {typeof card.value === 'number' && card.title !== 'Total Revenue' 
                    ? card.value.toLocaleString() 
                    : card.value
                  }
                </p>
                <div className="flex items-center">
                  <span className={`text-xs font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;