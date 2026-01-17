
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import DonationSuccess from "./pages/DonationSuccess";
import DonationCancelled from "./pages/DonationCancelled";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventPoster from "./pages/EventPoster";
import ChatPage from "./pages/ChatPage";
import ChatHome from "./pages/ChatHome";
import ChatMood from "./pages/ChatMood";
import ChatJournal from "./pages/ChatJournal";
import ChatSettings from "./pages/ChatSettings";
import ChatAI from "./pages/ChatAI";
import Therapy from "./pages/Therapy";
import Analytics from "@/components/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Analytics />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/donation-cancelled" element={<DonationCancelled />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/attending" element={<EventPoster />} />
            <Route path="/events" element={<Events />} />
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/chat/*" element={<ChatPage />}>
              <Route index element={<ChatAI />} />
              <Route path="home" element={<ChatHome />} />
              <Route path="mood" element={<ChatMood />} />
              <Route path="journal" element={<ChatJournal />} />
              <Route path="settings" element={<ChatSettings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;