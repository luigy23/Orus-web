import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userDataAtom, userTokenAtom } from "../../atoms/userAtom";

export default function RutaProtegida({ children, soloAdmin = false }) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);
  const [userToken] = useAtom(userTokenAtom);

  // Verificación adicional: si no hay token en storage, no está realmente autenticado
  const hasValidToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token && !!userToken;
  };

  // Si no está autenticado o no tiene token válido
  if (!isAuthenticated || !hasValidToken()) {
    console.log("🚫 Acceso denegado - No está autenticado");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("hasValidToken:", hasValidToken());
    console.log("userData:", userData);
    return <Navigate to="/" />;
  }

  // Si requiere ser admin pero no lo es
  if (soloAdmin && userData?.rol !== "admin") {
    console.log("🚫 Acceso denegado - No es admin");
    console.log("userData.rol:", userData?.rol);
    return <Navigate to="/dashboard" />;
  }

  return children;
}
