
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type UserRole } from "../../contexts/AuthContext";

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
};

export default function ProtectedRoute({
  allowedRoles
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-slate-600">
          Sua conta ainda não possui um perfil de acesso.
        </p>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    const destino = {
      admin: "/admin",
      associado: "/associado",
      empresa: "/empresa"
    }[role];

    return <Navigate to={destino} replace />;
  }

  return <Outlet />;
}
