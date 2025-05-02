import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../lib/Axios";
import {
  isAuthenticatedAtom,
  userTokenAtom,
  userDataAtom,
} from "../atoms/userAtom";

export const useLogin = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUserToken] = useAtom(userTokenAtom);
  const [, setUserData] = useAtom(userDataAtom);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password, rememberMe) => {
    try {
      const response = await Axios.post("/api/auth/login", {
        Correo: email,
        Contrasena: password,
      });

      const { token, usuario } = response.data;

      setUserToken(token);
      setUserData(usuario);
      setIsAuthenticated(true);
      

      if (rememberMe) {
        localStorage.setItem("token", token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Correo o contraseña inválidos");
    }
  };

  return { login, error };
};
