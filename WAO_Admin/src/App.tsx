import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "@/components/LoginPage";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import OrdersPage from "@/pages/OrdersPage";
import FileRepositoryPage from "@/pages/FileRepositoryPage";
import FeedbackCenterPage from "@/pages/FeedbackCenterPage";
import EventSchedulerPage from "@/pages/EventSchedulerPage";
import SettingsPage from "@/pages/SettingsPage";
import { api } from "@/lib/api";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AdminAnalyticsPage from "@/pages/AdminAnalyticsPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return !!localStorage.getItem('wao_admin_token'); } catch { return false; }
  });

  const handleLogin = async (credentials: { username: string; password: string }) => {
    // map username to email field for backend
    await api.adminLogin({ email: credentials.username, password: credentials.password });
    try {
      localStorage.setItem('wao_admin_last_activity', new Date().toISOString());
    } catch {}
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try { 
      localStorage.removeItem('wao_admin_token');
      localStorage.removeItem('wao_admin_profile');
      localStorage.removeItem('wao_admin_last_activity');
    } catch {}
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isAuthenticated ? (
              <Routes>
                <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="files" element={<FileRepositoryPage />} />
                  <Route path="feedback" element={<FeedbackCenterPage />} />
                  <Route path="events" element={<EventSchedulerPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                {/* Redirect root to admin dashboard */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                {/* Catch all other routes and redirect to admin */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
              </Routes>
            )}
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;