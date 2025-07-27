import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticatedAtom,
  userTokenAtom,
  userDataAtom,
} from "../atoms/userAtom";

export const useLogout = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const navigate = useNavigate();

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    
    // Limpiar atoms
    setIsAuthenticated(false);
    setUserToken("");
    setUserData({});
    
    // Limpiar ambos storages completamente
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    // También limpiar cualquier dato persistente de atoms que pueda quedar
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    
    console.log("✅ Sesión cerrada exitosamente - Redirigiendo al login");
    navigate("/");
  };

  return { logout };
}; 