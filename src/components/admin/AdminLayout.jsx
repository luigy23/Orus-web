import React from 'react';
import { useAtom } from "jotai";
import { userDataAtom } from "../../atoms/userAtom";
import { useLogin } from "../../hooks/useLogin";
import AdminSidebar from './AdminSidebar';

/**
 * Layout principal para páginas de administración
 * Incluye sidebar de navegación y área de contenido
 */
const AdminLayout = ({ children, title = "Panel de Administración" }) => {
  const [userData] = useAtom(userDataAtom);
  const { logoutUser } = useLogin();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Panel de administración de Orus
              </p>
            </div>
            
            {/* Usuario y logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  {userData?.rol}
                </p>
              </div>
              
              <button
                onClick={logoutUser}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>
        
        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;