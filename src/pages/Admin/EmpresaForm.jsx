import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import AdminService from '../../services/admin.service';
import { SelectDepartamento, SelectCiudad } from '../../components/ui/GeographicSelectors';

/**
 * Formulario para crear y editar empresas
 * Maneja todos los campos del modelo Empresa según especificaciones
 */
const EmpresaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe ID, estamos editando
  const isEditing = Boolean(id);

  // Estados del formulario
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    Direccion: '',
    Latitud: '',
    Longitud: '',
    SitioWeb: '',
    Email: '',
    UsuarioCorreo: '',
    Telefono: '',
    ciudadId: null, // Cambiado de Ciudad a ciudadId
    HorarioLunes: '',
    HorarioMartes: '',
    HorarioMiercoles: '',
    HorarioJueves: '',
    HorarioViernes: '',
    HorarioSabado: '',
    HorarioDomingo: '',
    Estado: 'ACTIVO',
    categorias: []
  });

  // Estado para manejar departamento seleccionado
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

  // Estados auxiliares
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditing);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categorias, setCategorias] = useState([]);

  /**
   * Cargar datos de empresa para edición
   */
  const cargarEmpresa = useCallback(async () => {
    if (!isEditing) return;
    
    try {
      setLoadingInitial(true);
      const empresa = await AdminService.getEmpresaPorId(id);
      
      // Convertir datos de empresa al formato del formulario
      setFormData({
        Nombre: empresa.Nombre || '',
        Descripcion: empresa.Descripcion || '',
        Direccion: empresa.Direccion || '',
        ciudadId: empresa.ciudadId || null, // Usar ciudadId del backend
        Latitud: empresa.Latitud?.toString() || '',
        Longitud: empresa.Longitud?.toString() || '',
        SitioWeb: empresa.SitioWeb || '',
        Email: empresa.Email || '',
        UsuarioCorreo: empresa.UsuarioCorreo || '',
        Telefono: empresa.Telefono || '',
        HorarioLunes: empresa.HorarioLunes || '',
        HorarioMartes: empresa.HorarioMartes || '',
        HorarioMiercoles: empresa.HorarioMiercoles || '',
        HorarioJueves: empresa.HorarioJueves || '',
        HorarioViernes: empresa.HorarioViernes || '',
        HorarioSabado: empresa.HorarioSabado || '',
        HorarioDomingo: empresa.HorarioDomingo || '',
        Estado: empresa.Estado || 'ACTIVO',
        categorias: empresa.Categorias?.map(cat => cat.Categoria.id) || []
      });

      // Si hay ciudadId, obtener el departamento para los selectores
      if (empresa.ciudadId && empresa.Ciudad) {
        setDepartamentoSeleccionado(empresa.Ciudad.departamentoId);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar empresa:', error);
      setError('Error al cargar los datos de la empresa.');
    } finally {
      setLoadingInitial(false);
    }
  }, [id, isEditing]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarEmpresa();
  }, [cargarEmpresa]);

  // Cargar categorías disponibles
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const categoriasData = await AdminService.getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        setError('Error al cargar categorías.');
      }
    };

    cargarDatos();
  }, []);

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
   * Validar que la hora de cierre sea posterior a la de apertura
   */
  const validarHorario = (inicio, fin) => {
    if (!inicio || !fin) return true;
    
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFin, minutoFin] = fin.split(':').map(Number);
    
    const tiempoInicio = horaInicio * 60 + minutoInicio;
    const tiempoFin = horaFin * 60 + minutoFin;
    
    return tiempoFin > tiempoInicio;
  };

  /**
   * Manejar cambios en horarios con selectores (versión corregida)
   */
  const handleHorarioChange = (dia, tipo, valor) => {
    const horarioActual = formData[dia] || '';
    
    if (tipo === 'cerrado') {
      // Si se marca como cerrado, limpiar el horario
      setFormData(prev => ({
        ...prev,
        [dia]: valor ? 'Cerrado' : ''
      }));
      return;
    }

    // Parsear horario actual
    let horaInicio = '';
    let horaFin = '';
    
    if (horarioActual && horarioActual !== 'Cerrado') {
      if (horarioActual.includes('-')) {
        const partes = horarioActual.split('-');
        horaInicio = partes[0]?.trim() || '';
        horaFin = partes[1]?.trim() || '';
      } else {
        // Si no tiene guión, es solo la hora de inicio
        horaInicio = horarioActual.trim();
      }
    }

    // Debug específico para sábado y domingo
    if (dia === 'HorarioSabado' || dia === 'HorarioDomingo') {
      console.log(`🔍 ${dia} - ${tipo}:`, { valor, horarioActual: formData[dia] });
      console.log(`🔍 ${dia} parsed:`, { horaInicio, horaFin });
    }

    // Actualizar la hora correspondiente
    if (tipo === 'inicio') {
      horaInicio = valor;
      // Si hay hora de fin y es menor que la nueva hora de inicio, limpiarla
      if (horaFin && !validarHorario(valor, horaFin)) {
        horaFin = '';
      }
    } else if (tipo === 'fin') {
      horaFin = valor;
      // No cambiar la hora de inicio, solo validar
    }

    // Formatear el horario final
    let nuevoHorario = '';
    if (horaInicio && horaFin) {
      if (validarHorario(horaInicio, horaFin)) {
        nuevoHorario = `${horaInicio}-${horaFin}`;
      } else {
        // Si hay conflicto de validación, mantener solo la parte que se está editando
        nuevoHorario = tipo === 'inicio' ? horaInicio : `${horaInicio}-${horaFin}`;
      }
    } else if (horaInicio) {
      nuevoHorario = horaInicio;
    } else if (horaFin) {
      nuevoHorario = horaFin;
    }

    setFormData(prev => ({
      ...prev,
      [dia]: nuevoHorario
    }));

    // Debug final para sábado y domingo
    if (dia === 'HorarioSabado' || dia === 'HorarioDomingo') {
      console.log(`🔍 ${dia} resultado final:`, nuevoHorario);
    }
  };

  /**
   * Generar opciones de horas (cada 30 minutos)
   */
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let hora = 6; hora <= 23; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        const tiempo = `${horaStr}:${minutoStr}`;
        opciones.push(tiempo);
      }
    }
    return opciones;
  };

  /**
   * Obtener hora de inicio y fin desde el horario formateado (versión corregida)
   */
  const parseHorario = (horario) => {
    if (!horario || horario === 'Cerrado') {
      return { inicio: '', fin: '', cerrado: horario === 'Cerrado' };
    }
    
    if (horario.includes('-')) {
      const partes = horario.split('-');
      return {
        inicio: partes[0]?.trim() || '',
        fin: partes[1]?.trim() || '',
        cerrado: false
      };
    }
    
    // Si solo hay una hora (sin guión), es la hora de inicio
    return { inicio: horario.trim(), fin: '', cerrado: false };
  };

  /**
   * Aplicar horario predefinido a todos los días laborales
   */
  const aplicarHorarioPredefinido = (tipo) => {
    let horario = '';
    switch (tipo) {
      case 'oficina':
        horario = '08:00-17:00';
        break;
      case 'comercio':
        horario = '09:00-19:00';
        break;
      case 'restaurante':
        horario = '11:00-22:00';
        break;
      case 'cerrado':
        horario = 'Cerrado';
        break;
      default:
        return;
    }

    const diasLaborales = ['HorarioLunes', 'HorarioMartes', 'HorarioMiercoles', 'HorarioJueves', 'HorarioViernes'];
    const nuevosHorarios = {};
    
    if (tipo === 'cerrado') {
      // Aplicar a todos los días
      ['HorarioLunes', 'HorarioMartes', 'HorarioMiercoles', 'HorarioJueves', 'HorarioViernes', 'HorarioSabado', 'HorarioDomingo']
        .forEach(dia => {
          nuevosHorarios[dia] = horario;
        });
    } else {
      // Solo días laborales
      diasLaborales.forEach(dia => {
        nuevosHorarios[dia] = horario;
      });
    }

    setFormData(prev => ({
      ...prev,
      ...nuevosHorarios
    }));
  };
  const handleCategoriaChange = (categoriaId) => {
    setFormData(prev => ({
      ...prev,
      categorias: (prev.categorias || []).includes(categoriaId)
        ? (prev.categorias || []).filter(id => id !== categoriaId)
        : [...(prev.categorias || []), categoriaId]
    }));
  };

  /**
   * Validar formulario antes de envío
   */
  const validarFormulario = () => {
    const errores = [];
    
    if (!formData.Nombre.trim()) errores.push('El nombre es obligatorio');
    if (!formData.Descripcion.trim()) errores.push('La descripción es obligatoria');
    if (!formData.Direccion.trim()) errores.push('La dirección es obligatoria');
    if (!formData.Email.trim()) errores.push('El email es obligatorio');
    if (!formData.UsuarioCorreo.trim()) errores.push('El usuario de correo es obligatorio');
    if (!formData.Telefono.trim()) errores.push('El teléfono es obligatorio');
    if ((formData.categorias || []).length === 0) errores.push('Debe seleccionar al menos una categoría');

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
      const datosEmpresa = {
        ...formData,
        Latitud: formData.Latitud ? parseFloat(formData.Latitud) : null,
        Longitud: formData.Longitud ? parseFloat(formData.Longitud) : null,
        categorias: formData.categorias || []
      };

      if (isEditing) {
        await AdminService.actualizarEmpresa(id, datosEmpresa);
        setSuccess('Empresa actualizada exitosamente');
      } else {
        await AdminService.crearEmpresa(datosEmpresa);
        setSuccess('Empresa creada exitosamente');
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/admin/empresas');
      }, 2000);

    } catch (error) {
      console.error('❌ Error al guardar empresa:', error);
      setError(error.response?.data?.error || 'Error al guardar la empresa');
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
                {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Modifica la información de la empresa' 
                  : 'Completa la información para registrar una nueva empresa'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/empresas')}
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
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="Ej: TechCorp Solutions"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="Estado"
                    value={formData.Estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  placeholder="Describe qué hace la empresa, sus servicios principales..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="contacto@empresa.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario de Correo *
                  </label>
                  <input
                    type="text"
                    name="UsuarioCorreo"
                    value={formData.UsuarioCorreo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="usuario.contacto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    name="SitioWeb"
                    value={formData.SitioWeb}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="https://www.empresa.com"
                  />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="Direccion"
                  value={formData.Direccion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                  placeholder="Calle 123 #45-67, Bogotá, Colombia"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="Latitud"
                    value={formData.Latitud}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="4.570868"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="Longitud"
                    value={formData.Longitud}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                    placeholder="-74.297333"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Horarios de Atención</h3>
                  <p className="text-sm text-gray-600 mt-1">Selecciona las horas de apertura y cierre, o marca como cerrado</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => aplicarHorarioPredefinido('oficina')}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Oficina (8:00-17:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarHorarioPredefinido('comercio')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Comercio (9:00-19:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => aplicarHorarioPredefinido('restaurante')}
                    className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                  >
                    Restaurante (11:00-22:00)
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              {[
                { name: 'HorarioLunes', label: 'Lunes' },
                { name: 'HorarioMartes', label: 'Martes' },
                { name: 'HorarioMiercoles', label: 'Miércoles' },
                { name: 'HorarioJueves', label: 'Jueves' },
                { name: 'HorarioViernes', label: 'Viernes' },
                { name: 'HorarioSabado', label: 'Sábado' },
                { name: 'HorarioDomingo', label: 'Domingo' }
              ].map((dia) => {
                const horarioInfo = parseHorario(formData[dia.name]);
                const opcionesHora = generarOpcionesHora();
                
                return (
                  <div key={dia.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        {dia.label}
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={horarioInfo.cerrado}
                          onChange={(e) => handleHorarioChange(dia.name, 'cerrado', e.target.checked)}
                          className="rounded border-gray-300 text-orus-primary focus:ring-orus-primary"
                        />
                        <span className="text-sm text-gray-600">Cerrado</span>
                      </label>
                    </div>
                    
                    {!horarioInfo.cerrado && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Hora de apertura
                          </label>
                          <select
                            key={`${dia.name}-inicio`}
                            id={`${dia.name}-inicio`}
                            name={`${dia.name}-inicio`}
                            value={horarioInfo.inicio}
                            onChange={(e) => handleHorarioChange(dia.name, 'inicio', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                          >
                            <option value="">Seleccionar</option>
                            {opcionesHora.map(hora => (
                              <option key={`${dia.name}-inicio-${hora}`} value={hora}>{hora}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Hora de cierre
                          </label>
                          <select
                            key={`${dia.name}-fin`}
                            id={`${dia.name}-fin`}
                            name={`${dia.name}-fin`}
                            value={horarioInfo.fin}
                            onChange={(e) => handleHorarioChange(dia.name, 'fin', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orus-primary focus:border-orus-primary"
                            disabled={!horarioInfo.inicio}
                          >
                            <option value="">Seleccionar</option>
                            {opcionesHora
                              .filter(hora => !horarioInfo.inicio || hora > horarioInfo.inicio)
                              .map(hora => (
                                <option key={`${dia.name}-fin-${hora}`} value={hora}>{hora}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                    
                    {/* Mostrar horario formateado con mejor diseño */}
                    {formData[dia.name] && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Horario configurado:</span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded ${
                            formData[dia.name] === 'Cerrado' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {formData[dia.name]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Categorías *</h3>
              <p className="text-sm text-gray-600 mt-1">Selecciona las categorías que aplican a esta empresa</p>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    className="relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.categorias || []).includes(categoria.id)}
                      onChange={() => handleCategoriaChange(categoria.id)}
                      className="sr-only"
                    />
                    <div className={`flex items-center space-x-2 ${
                      (formData.categorias || []).includes(categoria.id)
                        ? 'text-orus-primary'
                        : 'text-gray-700'
                    }`}>
                      <div className={`w-4 h-4 border-2 rounded ${
                        (formData.categorias || []).includes(categoria.id)
                          ? 'border-orus-primary bg-orus-primary'
                          : 'border-gray-300'
                      }`}>
                        {(formData.categorias || []).includes(categoria.id) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{categoria.Nombre}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Gestión de Imágenes */}
          {isEditing && id && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Imágenes de la Empresa</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Sube imágenes para mostrar tu empresa. Puedes reordenarlas y marcar una como principal.
                </p>
              </div>
              <div className="px-6 py-4">
                <ImageUploader 
                  empresaId={parseInt(id)}
                  maxImages={10}
                />
              </div>
            </div>
          )}

          {/* Nota para empresas nuevas */}
          {!isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Podrás subir imágenes después de crear la empresa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/empresas')}
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
                <span>{isEditing ? 'Actualizar Empresa' : 'Crear Empresa'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EmpresaForm;
