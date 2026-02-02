import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  Settings,
  LogOut,
  X,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  isMobile?: boolean;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview & Statistics'
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Payment Verification'
  },
  {
    name: 'File Repository',
    href: '/admin/files',
    icon: FolderOpen,
    description: 'Document Management'
  },
  {
    name: 'Feedback Center',
    href: '/admin/feedback',
    icon: MessageSquare,
    description: 'Complaints & Suggestions'
  },
  {
    name: 'Event Scheduler',
    href: '/admin/events',
    icon: Calendar,
    description: 'Calendar & Meetings'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    description: 'Admin Performance'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System Configuration'
  }
];

const Sidebar = ({ isOpen, onClose, onLogout, isMobile = false }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          {/* Logo Section */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <img src="/wao_favicon.jpg" alt="WAO" className="w-6 h-6 object-cover rounded-md" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">WAO Admin</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors min-h-[48px]',
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 min-h-[48px]"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Mobile Header */}
          <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <img src="/wao_favicon.jpg" alt="WAO" className="w-6 h-6 object-cover rounded-md" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">WAO Admin</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center px-4 py-4 text-base font-medium rounded-lg transition-colors min-h-[56px]',
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-4 h-6 w-6 flex-shrink-0',
                      isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-base">{item.name}</div>
                    <div className="text-sm text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <Button
              onClick={() => {
                onClose();
                onLogout();
              }}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 min-h-[56px] text-base"
            >
              <LogOut className="mr-4 h-6 w-6" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
              <div>
                <h1 className="text-lg font-bold text-gray-900">WAO Admin</h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Logout Button - Always Visible */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        isOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white border-r border-gray-200">
          {/* Mobile Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <img src="/wao_favicon.jpg" alt="WAO" className="w-5 h-5 object-cover rounded-md" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">WAO Admin</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile Logout - Always Visible */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <Button
              onClick={() => {
                onClose();
                onLogout();
              }}
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;