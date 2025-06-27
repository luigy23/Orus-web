import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userDataAtom } from "./atoms/userAtom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import PanelAdmin from "./pages/PanelAdmin";
import RutaProtegida from "./components/common/RutaProtegida";
import { useEffect } from "react";

export default function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userData) {
      if (userData.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, userData, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida soloAdmin={true}>
            <PanelAdmin />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
