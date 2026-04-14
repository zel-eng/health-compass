import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For patient route, allow if user exists and not doctor/admin (roles loading or patient)
  if (location.pathname === "/patient" && user && !roles.some(r => ["doctor", "admin"].includes(r))) {
    return <>{children}</>;
  }

  if (!allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
