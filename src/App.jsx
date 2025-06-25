import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "./atoms/userAtom";
import { Provider } from "jotai";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import { useEffect } from "react";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import Buscador from "./pages/Buscador";

export default function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const navigate = useNavigate(); // Obtén la función navigate

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Provider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/empresas/:slugId" element={<EmpresaDetalle />} />
        <Route path="/buscar" element={<Buscador />} />
      </Routes>
    </Provider>
  );
}
