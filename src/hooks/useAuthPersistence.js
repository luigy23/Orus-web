import { useAtom } from "jotai";
import { useEffect } from "react";
import { isAuthenticatedAtom, userTokenAtom, userDataAtom, authLoadingAtom } from "../atoms/userAtom";

/**
 * Hook para manejar la persistencia del estado de autenticación
 * Verifica si existe un token válido al cargar la aplicación
 */
export const useAuthPersistence = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const [, setIsLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Iniciando verificación de autenticación...');
      
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No hay token en localStorage');
        setIsLoading(false);
        return;
      }

      console.log('✅ Token encontrado en localStorage');
      // Limpiar comillas si las tiene
      const cleanToken = token.replace(/^"|"$/g, '');
      
      // Verificar si el token está bien formado y no ha expirado
      console.log('🔄 Verificando validez del token...');
      try {
        // Decodificar el JWT manualmente (solo la parte del payload)
        const tokenParts = cleanToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Verificar si el token no ha expirado
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp > now) {
            console.log('✅ Token válido, restaurando sesión...');
            
            // Restaurar el estado de autenticación
            setUserToken(cleanToken);
            setUserData({
              correo: payload.correo,
              nombre: payload.nombre,
              rol: payload.rol || 'USUARIO'
            });
            setIsAuthenticated(true);
            
            console.log('✅ Sesión restaurada:', payload.nombre);
          } else {
            console.log('❌ Token expirado');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } else {
          console.log('❌ Token mal formado');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (decodeError) {
        console.error('❌ Error decodificando token:', decodeError);
        // Si no se puede decodificar, limpiar todo
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
      
      console.log('✅ Verificación de autenticación completada - estableciendo loading a false');
      setIsLoading(false);
    };

    initializeAuth();
  }, [setIsAuthenticated, setUserToken, setUserData, setIsLoading]);
};

export default useAuthPersistence;