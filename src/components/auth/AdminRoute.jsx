import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import { isAuthenticatedAtom, userDataAtom } from "../../atoms/userAtom";

/**
 * Componente para proteger rutas que requieren permisos de administrador
 * Redirige a login si no está autenticado o a home si no es admin
 */
const AdminRoute = ({ children }) => {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es administrador, redirigir a home
  if (userData?.rol !== 'ADMINISTRADOR') {
    return <Navigate to="/home" replace />;
  }

  // Si es administrador, mostrar el contenido
  return children;
};

export default AdminRoute;