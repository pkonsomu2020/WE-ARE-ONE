import { useEffect, useMemo, useState } from 'react';
import { Menu, Bell, User, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/contexts/NotificationContext';
import { api } from '@/lib/api';

interface TopBarProps {
  onMenuClick: () => void;
  onLogout: () => void;
  isMobile?: boolean;
}

type StoredProfile = {
  fullName?: string;
  email?: string;
  role?: string;
};

const TopBar = ({ onMenuClick, onLogout, isMobile = false }: TopBarProps) => {
  const { unreadCount } = useNotifications();
  const [adminProfile, setAdminProfile] = useState<StoredProfile | null>(null);
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  useEffect(() => {
    setAdminProfile(api.getAdminProfile());

    try {
      const stored = localStorage.getItem('wao_admin_last_activity');
      setLastActivity(stored);
    } catch {
      setLastActivity(null);
    }
  }, []);

  const formattedLastActivity = useMemo(() => {
    if (!lastActivity) return 'Unknown';
    const date = new Date(lastActivity);
    return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
  }, [lastActivity]);

  return (
    <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-gray-200 bg-white px-3 sm:px-4 shadow-sm lg:px-8">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden min-h-[44px] min-w-[44px] p-2"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      {/* Page Title Area */}
      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {isMobile ? 'WAO Admin' : 'We Are One Admin Portal'}
            </h2>
            <div className="hidden text-xs text-gray-500 sm:flex sm:items-center sm:gap-2">
              <Clock3 className="h-3 w-3" />
              <span>Last activity: {formattedLastActivity}</span>
            </div>
          </div>
        </div>
        
        {/* Right side items */}
        <div className="ml-auto flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 sm:h-8 sm:w-8 rounded-full min-h-[44px] min-w-[44px] sm:min-h-[44px] sm:min-w-[44px]"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminProfile?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminProfile?.email || 'admin@weareone.co.ke'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminProfile?.role || 'Administrator'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;