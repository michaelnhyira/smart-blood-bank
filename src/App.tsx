import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BloodBankProvider } from "@/contexts/BloodBankContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/personnel/Dashboard";
import Inventory from "@/pages/personnel/Inventory";
import AddStock from "@/pages/personnel/AddStock";
import RecordUsage from "@/pages/personnel/RecordUsage";
import StorageManagement from "@/pages/personnel/StorageManagement";
import ExpiryMonitor from "@/pages/personnel/ExpiryMonitor";
import SmartAlerts from "@/pages/personnel/SmartAlerts";
import Analytics from "@/pages/personnel/Analytics";
import DonorHome from "@/pages/donor/DonorHome";
import DonorHistory from "@/pages/donor/DonorHistory";
import DonorNotifications from "@/pages/donor/DonorNotifications";
import BookDonation from "@/pages/donor/BookDonation";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: ReactNode; allowedRole?: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'personnel' ? '/personnel/dashboard' : '/donor/home'} replace />;
  }
  return <>{children}</>;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'personnel' ? '/personnel/dashboard' : '/donor/home'} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BloodBankProvider>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/personnel/dashboard" element={<ProtectedRoute allowedRole="personnel"><Dashboard /></ProtectedRoute>} />
                <Route path="/personnel/inventory" element={<ProtectedRoute allowedRole="personnel"><Inventory /></ProtectedRoute>} />
                <Route path="/personnel/add-stock" element={<ProtectedRoute allowedRole="personnel"><AddStock /></ProtectedRoute>} />
                <Route path="/personnel/record-usage" element={<ProtectedRoute allowedRole="personnel"><RecordUsage /></ProtectedRoute>} />
                <Route path="/personnel/storage" element={<ProtectedRoute allowedRole="personnel"><StorageManagement /></ProtectedRoute>} />
                <Route path="/personnel/expiry" element={<ProtectedRoute allowedRole="personnel"><ExpiryMonitor /></ProtectedRoute>} />
                <Route path="/personnel/alerts" element={<ProtectedRoute allowedRole="personnel"><SmartAlerts /></ProtectedRoute>} />
                <Route path="/personnel/analytics" element={<ProtectedRoute allowedRole="personnel"><Analytics /></ProtectedRoute>} />
                <Route path="/donor/home" element={<ProtectedRoute allowedRole="donor"><DonorHome /></ProtectedRoute>} />
                <Route path="/donor/history" element={<ProtectedRoute allowedRole="donor"><DonorHistory /></ProtectedRoute>} />
                <Route path="/donor/notifications" element={<ProtectedRoute allowedRole="donor"><DonorNotifications /></ProtectedRoute>} />
                <Route path="/donor/book" element={<ProtectedRoute allowedRole="donor"><BookDonation /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BloodBankProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
