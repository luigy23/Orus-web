import { useAtom } from "jotai";
import { useEffect } from "react";
import { isAuthenticatedAtom, userTokenAtom, userDataAtom } from "../atoms/userAtom";
import axiosClient from "../lib/Axios";

/**
 * Hook para manejar la persistencia del estado de autenticación
 * Verifica si existe un token válido al cargar la aplicación
 */
export const useAuthPersistence = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        // Limpiar comillas si las tiene
        const cleanToken = token.replace(/^"|"$/g, '');
        
        // Intentar hacer una petición para verificar si el token es válido
        // Usando el endpoint de empresas que requiere autenticación
        const response = await axiosClient.get('/api/empresas');
        
        if (response.status === 200) {
          // Token válido, decodificar la información del usuario desde el token
          try {
            // Decodificar el JWT manualmente (solo la parte del payload)
            const tokenParts = cleanToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              
              // Restaurar el estado de autenticación
              setUserToken(cleanToken);
              setUserData({
                correo: payload.correo,
                nombre: payload.nombre,
                rol: payload.rol || 'USUARIO'
              });
              setIsAuthenticated(true);
              
              console.log('✅ Sesión restaurada:', payload.nombre);
            }
          } catch (decodeError) {
            console.error('❌ Error decodificando token:', decodeError);
            // Si no se puede decodificar, limpiar todo
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        // Token inválido o expirado, limpiar
        console.log('🔄 Token expirado o inválido, limpiando sesión');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserToken('');
        setUserData({});
      }
    };

    initializeAuth();
  }, [setIsAuthenticated, setUserToken, setUserData]);
};

export default useAuthPersistence;