import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/guard/ProtectedRoute";

import Login from "./pages/auth/Login";
import DashboardAdmin from "./pages/admin/Dashboard";
import DashboardAssociado from "./pages/associado/Dashboard";
import DashboardEmpresa from "./pages/empresa/Dashboard";

function PaginaInicial() {
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

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "associado") {
    return <Navigate to="/associado" replace />;
  }

  if (role === "empresa") {
    return <Navigate to="/empresa" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <p className="text-slate-600">
        Sua conta ainda não possui um perfil de acesso.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={<ProtectedRoute allowedRoles={["admin"]} />}
      >
        <Route path="/admin" element={<DashboardAdmin />} />
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["associado"]} />}
      >
        <Route
          path="/associado"
          element={<DashboardAssociado />}
        />
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["empresa"]} />}
      >
        <Route path="/empresa" element={<DashboardEmpresa />} />
      </Route>

      <Route path="/" element={<PaginaInicial />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
