import { useAtom } from "jotai";
import { useEffect } from "react";
import { isAuthenticatedAtom, userTokenAtom, userDataAtom } from "../atoms/userAtom";
import { debugAuthState } from "../utils/authDebug";

export const useAuthInitialization = () => {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userToken, setUserToken] = useAtom(userTokenAtom);
  const [userData, setUserData] = useAtom(userDataAtom);

  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 Inicializando estado de autenticación...");
      
      // Debug del estado inicial
      debugAuthState();
      
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      
      if (token) {
        // Si hay token, asegurar que todos los atoms estén sincronizados
        if (!isAuthenticated) {
          console.log("✅ Restaurando estado de autenticación");
          setIsAuthenticated(true);
        }
        
        if (!userToken || userToken !== token) {
          console.log("✅ Sincronizando token");
          setUserToken(token);
        }

        // Si hay datos de usuario almacenados manualmente, migrarlos al atom
        if (storedUser && Object.keys(userData).length === 0) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log("✅ Migrando datos de usuario al atom");
            setUserData(parsedUser);
          } catch (error) {
            console.error("❌ Error al parsear datos de usuario:", error);
          }
        }
      } else {
        // Si no hay token, limpiar todo
        if (isAuthenticated || userToken || Object.keys(userData).length > 0) {
          console.log("🧹 Limpiando estado de autenticación inconsistente");
          setIsAuthenticated(false);
          setUserToken("");
          setUserData({});
        }
      }
      
      console.log("✅ Inicialización completada");
    };

    initializeAuth();
  }, []); // Solo ejecutar una vez al montar

  return {
    isAuthenticated,
    userToken,
    userData,
    isInitialized: true,
    debugAuthState // Exponer la función de debug
  };
}; 