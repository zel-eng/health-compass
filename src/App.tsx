import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Auth from "@/pages/Auth";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import DoctorDashboard from "@/pages/DoctorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  // Role-based routing
  const isAdmin = roles.includes("admin");
  const isDoctor = roles.includes("doctor");
  const isPatient = roles.includes("patient");

  return (
    <Routes>
      {isAdmin && (
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      )}
      {(isDoctor || isAdmin) && (
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor", "admin"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
      )}
      {isPatient && (
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
      )}
      <Route path="/*" element={<Index />} />
      <Route
        path="/"
        element={
          isAdmin ? <Navigate to="/admin" replace /> :
          isDoctor ? <Navigate to="/doctor" replace /> :
          isPatient ? <Navigate to="/patient" replace /> :
          <Index />
        }
      />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
