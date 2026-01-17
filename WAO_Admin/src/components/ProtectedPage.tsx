import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Lock } from 'lucide-react';

interface ProtectedPageProps {
  children: ReactNode;
  requiredPermission: 'orders' | 'settings';
  pageName: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://we-are-one-api.onrender.com';

export const ProtectedPage = ({ children, requiredPermission, pageName }: ProtectedPageProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const token = localStorage.getItem('wao_admin_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/feedback/admin-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        const profile = data.data;
        setAdminName(profile.fullName);

        
        // Check if user has permission
        const isSuperAdmin = profile.role === 'Super Admin' || profile.email === 'admin@weareone.co.ke';
        const hasPermission = requiredPermission === 'orders' 
          ? (isSuperAdmin || profile.canAccessOrders)
          : (isSuperAdmin || profile.canAccessSettings);
        
        setHasAccess(hasPermission);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Access check failed:', error);
      navigate('/login');
    }
  };

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{pageName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This page is restricted to authorized administrators only.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Current User:</strong> {adminName}</p>
              <p className="mt-2">
                If you believe you should have access to this page, please contact the Super Administrator.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
