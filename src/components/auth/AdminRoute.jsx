import { useAtom } from "jotai";
import { Navigate } from "react-router-dom";
import { isAuthenticatedAtom, userDataAtom, authLoadingAtom } from "../../atoms/userAtom";

/**
 * Componente para proteger rutas que requieren permisos de administrador
 * Redirige a login si no está autenticado o a home si no es admin
 */
const AdminRoute = ({ children }) => {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  console.log('🔍 AdminRoute - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading, 'rol:', userData?.rol);

  // Mientras se está verificando la autenticación, mostrar spinner
  if (authLoading) {
    console.log('🔄 AdminRoute - Mostrando spinner de carga');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-gray-600">Verificando permisos...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('❌ AdminRoute - No autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es administrador, redirigir a home
  if (userData?.rol !== 'ADMINISTRADOR') {
    console.log('❌ AdminRoute - No es administrador, redirigiendo a home');
    return <Navigate to="/home" replace />;
  }

  // Si es administrador, mostrar el contenido
  console.log('✅ AdminRoute - Es administrador, mostrando contenido');
  return children;
};

export default AdminRoute;