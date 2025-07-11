import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAtom, Provider } from "jotai";
import { isAuthenticatedAtom, userDataAtom } from "./atoms/userAtom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import PanelAdmin from "./pages/PanelAdmin";
import RutaProtegida from "./components/common/RutaProtegida";
import { useEffect } from "react";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import Buscador from "./pages/Buscador";
import Perfil from './pages/User/Perfil';
import Asesorias from './pages/Asesorias/Asesorias';
import PerfilAsesor from './pages/Asesorias/PerfilAsesor';
  
export default function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userData) {
      if (userData.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, userData, navigate]);

  return (
    <Provider>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Home /> : <LoginPage />
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/empresas/categoria/:categoria" element={<Empresas />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/empresas/:slugId" element={<EmpresaDetalle />} />
        <Route path="/buscar" element={<Buscador />} />
        <Route path="/perfil" element={<Perfil/>} />
        <Route path="/asesorias" element={<Asesorias/>} />
        <Route path="/asesorias/:id" element={<PerfilAsesor/>} />
        <Route
          path="/admin"
          element={
            <RutaProtegida soloAdmin={true}>
              <PanelAdmin />
            </RutaProtegida>
          }
        />
      </Routes>
    </Provider>
  );
}
