import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from '@/components/layout/TopBar';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout = ({ onLogout }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;