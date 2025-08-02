import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAtom } from "jotai";
import { isAuthenticatedAtom, authLoadingAtom } from "./atoms/userAtom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import { useEffect } from "react";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import EmpresaDetalle from "./pages/EmpresaDetalle";
import Buscador from "./pages/Buscador";
import Perfil from './pages/User/Perfil';
import Asesorias from './pages/Asesorias/Asesorias';
import PerfilAsesor from './pages/Asesorias/PerfilAsesor';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmpresasAdmin from './pages/Admin/EmpresasAdmin';
import EmpresaForm from './pages/Admin/EmpresaForm';
import EmpresaDetalleAdmin from './pages/Admin/EmpresaDetalleAdmin';
import CategoriasAdmin from './pages/Admin/CategoriasAdmin';
import Usuarios from './pages/Admin/Usuarios';
import UsuarioForm from './pages/Admin/UsuarioForm';
import useAuthPersistence from './hooks/useAuthPersistence';
  
export default function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authLoading, setAuthLoading] = useAtom(authLoadingAtom);
  const navigate = useNavigate(); // Obtén la función navigate
  
  // Restaurar sesión al cargar la aplicación
  useAuthPersistence();

  // Efecto para asegurar que el estado de carga se reinicie correctamente
  useEffect(() => {
    console.log('🔍 Estado actual - isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);
    // Si estamos autenticados, asegurar que no esté en loading
    if (isAuthenticated && authLoading) {
      console.log('🔧 Corrigiendo estado de carga...');
      setAuthLoading(false);
    }
  }, [isAuthenticated, authLoading, setAuthLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      // No redirigir automáticamente, dejar que el usuario esté donde está
      // navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Mostrar spinner de carga mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-gray-600">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Home /> : <LoginPage />
        } />
        <Route path="/login" element={<LoginPage />} />
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
        
        {/* Rutas de Administración */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/empresas" element={
          <AdminRoute>
            <EmpresasAdmin />
          </AdminRoute>
        } />
        <Route path="/admin/empresas/nueva" element={
          <AdminRoute>
            <EmpresaForm />
          </AdminRoute>
        } />
        <Route path="/admin/empresas/:id/editar" element={
          <AdminRoute>
            <EmpresaForm />
          </AdminRoute>
        } />
        <Route path="/admin/empresas/:id" element={
          <AdminRoute>
            <EmpresaDetalleAdmin />
          </AdminRoute>
        } />
        <Route path="/admin/categorias" element={
          <AdminRoute>
            <CategoriasAdmin />
          </AdminRoute>
        } />
        <Route path="/admin/usuarios" element={
          <AdminRoute>
            <Usuarios />
          </AdminRoute>
        } />
        <Route path="/admin/usuarios/nuevo" element={
          <AdminRoute>
            <UsuarioForm />
          </AdminRoute>
        } />
        <Route path="/admin/usuarios/:correo/editar" element={
          <AdminRoute>
            <UsuarioForm />
          </AdminRoute>
        } />
      </Routes>
    </>
  );
}
