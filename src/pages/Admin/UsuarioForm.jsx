// src/pages/Admin/UsuarioForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import UsuariosService from '../../services/usuarios.service';
import { SelectDepartamento, SelectCiudad } from '../../components/ui/GeographicSelectors';

/**
 * Formulario para crear y editar usuarios
 */
const UsuarioForm = () => {
  const navigate = useNavigate();
  const { correo: correoParam } = useParams();
  const correo = correoParam ? decodeURIComponent(correoParam) : null;
  const isEditing = Boolean(correo);

  // Estados del formulario
  const [formData, setFormData] = useState({
    Correo: '',
    NuevoCorreo: '', // Para cambio de correo en edición
    Nombre: '',
    Telefono: '',
    Contrasena: '',
    FechaNacimiento: '',
    Genero: '',
    Rol: 'USUARIO',
    ciudadId: null
  });

  // Estado para manejar departamento seleccionado
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

  // Estados auxiliares
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Cargar datos de usuario para edición
   */
  const cargarUsuario = useCallback(async () => {
    if (!isEditing) return;
    
    try {
      setLoadingInitial(true);
      const usuario = await UsuariosService.getUsuarioPorCorreo(correo);
      
      setFormData({
        Correo: usuario.Correo,
        NuevoCorreo: usuario.Correo,
        Nombre: usuario.Nombre || '',
        Telefono: usuario.Telefono || '',
        Contrasena: '', // No mostrar contraseña actual
        FechaNacimiento: usuario.FechaNacimiento ? usuario.FechaNacimiento.split('T')[0] : '',
        Genero: usuario.Genero || '',
        Rol: usuario.Rol || 'USUARIO',
        ciudadId: usuario.ciudadId || null
      });

      // Si hay ciudad, obtener el departamento para los selectores
      if (usuario.Ciudad && usuario.Ciudad.departamentoId) {
        setDepartamentoSeleccionado(usuario.Ciudad.departamentoId);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar usuario:', error);
      setError('Error al cargar los datos del usuario.');
    } finally {
      setLoadingInitial(false);
    }
  }, [correo, isEditing]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarUsuario();
  }, [cargarUsuario]);

  /**
   * Manejar cambios en campos de texto
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validar formulario antes de envío
   */
  const validarFormulario = () => {
    const errores = [];
    
    const correoFinal = isEditing ? formData.NuevoCorreo : formData.Correo;
    if (!correoFinal.trim()) errores.push('El correo es obligatorio');
    if (!formData.Nombre.trim()) errores.push('El nombre es obligatorio');
    
    // Validar contraseña solo si es nuevo usuario o si se está cambiando
    if (!isEditing && !formData.Contrasena.trim()) {
      errores.push('La contraseña es obligatoria para usuarios nuevos');
    }
    
    // Si hay contraseña (nueva o actualización), validar longitud
    if (formData.Contrasena.trim() && formData.Contrasena.length < 6) {
      errores.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoFinal)) {
      errores.push('El formato del correo no es válido');
    }

    return errores;
  };

  /**
   * Enviar formulario (crear o actualizar)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errores = validarFormulario();
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para envío
      const datosUsuario = {
        Nombre: formData.Nombre,
        Telefono: formData.Telefono || null,
        FechaNacimiento: formData.FechaNacimiento || null,
        Genero: formData.Genero || null,
        Rol: formData.Rol,
        ciudadId: formData.ciudadId
      };

      if (isEditing) {
        // Para edición - solo incluir campos que han cambiado
        if (formData.NuevoCorreo !== formData.Correo) {
          datosUsuario.NuevoCorreo = formData.NuevoCorreo;
        }
        if (formData.Contrasena.trim()) {
          datosUsuario.Contrasena = formData.Contrasena;
        }
        
        await UsuariosService.actualizarUsuario(formData.Correo, datosUsuario);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        // Para creación
        datosUsuario.Correo = formData.Correo;
        datosUsuario.Contrasena = formData.Contrasena;
        
        await UsuariosService.crearUsuario(datosUsuario);
        setSuccess('Usuario creado exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/usuarios');
      }, 2000);

    } catch (error) {
      console.error('❌ Error al guardar usuario:', error);
      setError(error.response?.data?.error || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras carga datos iniciales
  if (loadingInitial) {
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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifica la información del usuario' 
                  : 'Completa la información para crear un nuevo usuario'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/usuarios')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-green-800">
                <strong>Éxito:</strong> {success}
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditing ? 'Correo Actual' : 'Correo Electrónico'} *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.Correo}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  ) : (
                    <input
                      type="email"
                      name="Correo"
                      value={formData.Correo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                      placeholder="usuario@ejemplo.com"
                      required
                    />
                  )}
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuevo Correo (opcional)
                    </label>
                    <input
                      type="email"
                      name="NuevoCorreo"
                      value={formData.NuevoCorreo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                      placeholder="nuevo@ejemplo.com"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    name="Contrasena"
                    value={formData.Contrasena}
                    onChange={handleInputChange}
                    autoComplete={isEditing ? "new-password" : "current-password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder={isEditing ? "Dejar vacío para mantener actual" : "Contraseña segura"}
                    required={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="Rol"
                    value={formData.Rol}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  >
                    <option value="USUARIO">Usuario</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="FechaNacimiento"
                    value={formData.FechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <select
                    name="Genero"
                    value={formData.Genero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  >
                    <option value="">Seleccionar</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                    <option value="OTRO">Otro</option>
                    <option value="PREFIERO_NO_DECIRLO">Prefiero no decirlo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Ubicación</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <SelectDepartamento
                    value={departamentoSeleccionado}
                    onChange={setDepartamentoSeleccionado}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <SelectCiudad
                    departamentoId={departamentoSeleccionado}
                    value={formData.ciudadId}
                    onChange={(ciudadId) => setFormData(prev => ({ ...prev, ciudadId }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    disabled={!departamentoSeleccionado}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/usuarios')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orus-primary text-white rounded-lg hover:bg-orus-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UsuarioForm;
