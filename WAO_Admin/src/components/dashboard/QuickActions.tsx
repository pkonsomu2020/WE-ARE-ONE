import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      title: 'Verify Payments',
      description: 'Review pending M-Pesa transactions',
      href: '/admin/orders',
      color: 'bg-green-500',
      count: 5
    },
    {
      title: 'Upload Document',
      description: 'Add files to repository',
      href: '/admin/files',
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule Meeting',
      description: 'Create new calendar event',
      href: '/admin/events',
      color: 'bg-purple-500'
    },
    {
      title: 'View Feedback',
      description: 'Check new complaints/suggestions',
      href: '/admin/feedback',
      color: 'bg-orange-500',
      count: 3
    },
    {
      title: 'System Settings',
      description: 'Configure admin preferences',
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common administrative tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} to={action.href}>
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-5 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 border-l-4"
              style={{
                borderLeftColor: action.color.includes('green') ? '#10b981' :
                  action.color.includes('blue') ? '#3b82f6' :
                    action.color.includes('purple') ? '#8b5cf6' :
                      action.color.includes('orange') ? '#f97316' : '#6b7280'
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">{action.title}</h3>
                    {action.count && (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full ml-3 flex-shrink-0">
                        {action.count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;