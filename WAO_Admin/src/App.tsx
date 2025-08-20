import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "@/components/LoginPage";
import OrdersDashboard from "@/components/OrdersDashboard";
import { api } from "@/lib/api";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return !!localStorage.getItem('wao_admin_token'); } catch { return false; }
  });

  const handleLogin = async (credentials: { username: string; password: string }) => {
    // map username to email field for backend
    await api.adminLogin({ email: credentials.username, password: credentials.password });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try { localStorage.removeItem('wao_admin_token'); } catch {}
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isAuthenticated ? (
          <OrdersDashboard onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
