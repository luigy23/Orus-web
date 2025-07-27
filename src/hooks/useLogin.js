import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticatedAtom,
  userTokenAtom,
  userDataAtom,
} from "../atoms/userAtom";
import AuthService from "../services/auth.service";
import { useLogout } from "./useLogout";

export const useLogin = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useLogout();

  const loginUser = async (email, password, rememberMe) => {
    setError("");

    try {
      const response = await AuthService.login(email, password, rememberMe);
      console.log("✅ Respuesta login:", response);

      if (!response?.token || !response?.usuario) {
        setError("Respuesta inválida del servidor");
        return;
      }

      // Actualizar atoms (que automáticamente persisten en localStorage)
      setUserToken(response.token);
      setUserData(response.usuario);
      setIsAuthenticated(true);

      // Guardar token en el storage apropiado para AuthService y Axios
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", response.token);
      
      // Limpiar el storage contrario
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem("token");

      console.log("✅ Usuario logueado exitosamente - Redirigiendo a /home");
      console.log("👤 Usuario:", response.usuario.nombre, "| Rol:", response.usuario.rol);
      
      navigate("/home");
    } catch (err) {
      console.error("❌ Error en loginUser:", err);
      const mensaje =
        err.response?.data?.message || "Correo o contraseña inválidos";
      setError(mensaje);
    }
  };

  // Usar el hook de logout centralizado
  const logoutUser = logout;

  return { loginUser, error, logoutUser };
};
