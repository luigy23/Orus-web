// src/pages/Admin/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import UsuariosService from '../../services/usuarios.service';
import { Plus, Edit, Trash2, Search, UserCheck, UserX } from 'lucide-react';

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await UsuariosService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.Correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.Telefono && usuario.Telefono.includes(searchTerm))
  );

  // Eliminar usuario
  const handleEliminar = async (correo, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${nombre}"?`)) {
      try {
        await UsuariosService.eliminarUsuario(correo);
        await cargarUsuarios(); // Recargar la lista
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Formatear rol
  const formatearRol = (rol) => {
    return rol === 'ADMINISTRADOR' ? 'Admin' : 'Usuario';
  };

  // Color para el rol
  const colorRol = (rol) => {
    return rol === 'ADMINISTRADOR' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orus-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">
                Administra los usuarios del sistema
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/usuarios/nuevo')}
              className="bg-orus-primary text-white px-4 py-2 rounded-lg hover:bg-orus-primary/90 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
              />
            </div>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Usuarios ({usuariosFiltrados.length})
            </h3>
          </div>

          {usuariosFiltrados.length === 0 ? (
            <div className="p-8 text-center">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron usuarios con esos criterios' : 'Comienza creando un nuevo usuario'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Nacimiento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.Correo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orus-primary flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {usuario.Nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{usuario.Nombre}</div>
                            <div className="text-sm text-gray-500">{usuario.Correo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.Telefono || 'No especificado'}</div>
                        <div className="text-sm text-gray-500">{usuario.Genero || 'No especificado'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {usuario.Ciudad ? 
                            `${usuario.Ciudad.Nombre}, ${usuario.Ciudad.Departamento.Nombre}` : 
                            'No especificada'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorRol(usuario.Rol)}`}>
                          {formatearRol(usuario.Rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatearFecha(usuario.FechaNacimiento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/usuarios/${encodeURIComponent(usuario.Correo)}/editar`)}
                            className="text-orus-primary hover:text-orus-primary/80 p-1"
                            title="Editar usuario"
                          >
                            <Edit size={18} />
                          </button>
                          {usuario.Rol !== 'ADMINISTRADOR' && (
                            <button
                              onClick={() => handleEliminar(usuario.Correo, usuario.Nombre)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Usuarios;
