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

      const loginUser = async (email, password, rememberMe) => { // Cambiamos el nombre de la funcion a loginUser para evitar confucion con el nombre del servicio
        try {
          const data = await AuthService.login(email, password); // Llama a la función del servicio

          setUserToken(data.token);
          setUserData(data.usuario);
          setIsAuthenticated(true);

          if (rememberMe) {
            localStorage.setItem("token", data.token);
          }

          navigate("/dashboard");
        } catch (err) {
          setError(err.response?.data?.message || "Correo o contraseña inválidos"); //Manejamos el error.
        }
      };

      return { loginUser, error }; // Exponemos la nueva funcion
    };
    