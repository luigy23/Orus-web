import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticatedAtom,
  userTokenAtom,
  userDataAtom,
  authLoadingAtom,
} from "../atoms/userAtom";
import AuthService from "../services/auth.service";

export const useLogin = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (email, password, rememberMe) => {
    setError(""); // limpia errores anteriores

    try {
      const response = await AuthService.login(email, password, rememberMe);
      console.log("✅ Respuesta login:", response);

      if (!response?.token || !response?.usuario) {
        setError("Respuesta inválida del servidor");
        return;
      }

      setUserToken(response.token);
      setUserData(response.usuario);
      setIsAuthenticated(true);
      setAuthLoading(false); // ¡CRÍTICO! Marcar que ya no está cargando

      if (rememberMe) {
        localStorage.setItem("token", response.token);
      }

      // Redirigir según el rol del usuario
      if (response.usuario.rol === 'ADMINISTRADOR') {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("❌ Error en loginUser:", err);
      setAuthLoading(false); // También marcar como no cargando en caso de error
      const mensaje =
        err.response?.data?.message || "Correo o contraseña inválidos";
      setError(mensaje);
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserToken("");
    setUserData({});
    setAuthLoading(false); // Asegurar que no esté en estado de carga
    localStorage.removeItem("token");
    navigate("/login");
  };  

  return { loginUser, error, logoutUser };
};
