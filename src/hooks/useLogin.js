import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticatedAtom,
  userTokenAtom,
  userDataAtom,
} from "../atoms/userAtom";
import AuthService from "../services/auth.service";

export const useLogin = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (email, password, rememberMe) => {
    setError(""); // limpia errores anteriores

    try {
      const response = await AuthService.login(email, password);
      console.log("✅ Respuesta login:", response);

      if (!response?.token || !response?.usuario) {
        setError("Respuesta inválida del servidor");
        return;
      }

      setUserToken(response.token);
      setUserData(response.usuario);
      setIsAuthenticated(true);

      if (rememberMe) {
        localStorage.setItem("token", response.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error en loginUser:", err);
      const mensaje =
        err.response?.data?.message || "Correo o contraseña inválidos";
      setError(mensaje);
    }
  };

  return { loginUser, error };
};
