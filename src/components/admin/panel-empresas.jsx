"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import EmpresaModal from "./empresa-modal";
import EmpresaService from "../../services/empresa.service";
import CategoriaService from "../../services/categoria.service";

export default function PanelEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaActual, setEmpresaActual] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState(null);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const empresasPorPagina = 5;

  const mostrarHoraLegible = (valor) => {
    if (!valor) return "";
    try {
      const date = new Date(valor);
      return date.toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
    } catch {
      return "";
    }
  };

  // Filtrar empresas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = empresas.filter(
        (empresa) =>
          empresa.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.Ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.Categorias?.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredEmpresas(filtered);
      setCurrentPage(1);
    } else {
      setFilteredEmpresas(empresas);
    }
  }, [searchTerm, empresas]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await EmpresaService.obtenerTodas(token);
        setEmpresas(data);
        setFilteredEmpresas(data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const categorias = await CategoriaService.obtenerTodas(token);
        setCategoriasDisponibles(categorias.map((cat) => cat.Nombre));
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Calcular empresas para la página actual
  const indexOfLastEmpresa = currentPage * empresasPorPagina;
  const indexOfFirstEmpresa = indexOfLastEmpresa - empresasPorPagina;
  const empresasActuales = filteredEmpresas.slice(
    indexOfFirstEmpresa,
    indexOfLastEmpresa
  );
  const totalPages = Math.ceil(filteredEmpresas.length / empresasPorPagina);

  // Manejadores de eventos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateEmpresa = () => {
    setEmpresaActual(null);
    setModalOpen(true);
  };

  const handleEditEmpresa = (empresa) => {
    setEmpresaActual(empresa);
    setModalOpen(true);
  };

  const handleDeleteClick = (empresa) => {
    setEmpresaToDelete(empresa);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    setEmpresas(empresas.filter((e) => e.id !== empresaToDelete.id));
    setDeleteConfirmOpen(false);
    setEmpresaToDelete(null);
  };

  const handleSaveEmpresa = async (empresa) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userRaw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!token || !user) throw new Error("Token o usuario no encontrado");

      empresa.email = user.correo;

      // Convertir horarios si vienen como "HH:mm"
      if (
        typeof empresa.HorarioApertura === "string" &&
        /^\d{2}:\d{2}$/.test(empresa.HorarioApertura)
      ) {
        empresa.HorarioApertura = new Date(
          `1970-01-01T${empresa.HorarioApertura}:00Z`
        );
      }
      if (
        typeof empresa.HorarioCierre === "string" &&
        /^\d{2}:\d{2}$/.test(empresa.HorarioCierre)
      ) {
        empresa.HorarioCierre = new Date(
          `1970-01-01T${empresa.HorarioCierre}:00Z`
        );
      }

      // Obtener las categorías existentes
      const categoriasExistentes = [...categoriasDisponibles];

      // Filtrar categorías nuevas
      const nuevasCategorias = empresa.Categorias.filter(
        (cat) => !categoriasExistentes.includes(cat)
      );

      // Crear las categorías nuevas si hay
      for (const nueva of nuevasCategorias) {
        await CategoriaService.crear({ Nombre: nueva }, token);
      }

      empresa.Categorias = [...empresa.Categorias];

      // Recargar categorías disponibles
      const actualizadas = await CategoriaService.obtenerTodas(token);
      setCategoriasDisponibles(actualizadas.map((cat) => cat.Nombre));

      // Crear o actualizar empresa
      if (!empresa.id) {
        await EmpresaService.crear(empresa, token);
      } else {
        await EmpresaService.actualizar(empresa, token);
      }

      const data = await EmpresaService.obtenerTodas(token);
      setEmpresas(data);
      setFilteredEmpresas(data);
      setModalOpen(false);
    } catch (error) {
      console.error("❌ Error al guardar la empresa:", error);
      alert("Error al guardar la empresa");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-orus-primary text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center">
            <Building2 className="mr-2" size={24} />
            Administración de Empresas
          </h1>
          <p className="text-sm sm:text-base opacity-80">
            Gestiona los perfiles completos de las empresas registradas
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Barra de acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orus-primary text-sm"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <button
            onClick={handleCreateEmpresa}
            className="bg-orus-primary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-full text-sm flex items-center transition duration-200 w-full sm:w-auto justify-center">
            <Plus size={18} className="mr-1" />
            Nueva Empresa
          </button>
        </div>

        {/* Tabla de empresas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Versión para escritorio */}
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horarios
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorías
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empresasActuales.length > 0 ? (
                  empresasActuales.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {empresa.Imagenes && empresa.Imagenes.length > 0 ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={
                                  empresa.Imagenes[0].url || "/placeholder.svg"
                                }
                                alt={empresa.Imagenes[0].descripcion}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {empresa.Nombre}
                            </div>
                            <div className="text-xs text-gray-500">
                              {empresa.nit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {empresa.Ciudad}
                        </div>
                        <div className="text-xs text-gray-500">
                          {empresa.Telefono}
                        </div>
                        <div className="text-xs text-gray-500">
                          {empresa.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {mostrarHoraLegible(empresa.HorarioApertura)} -{" "}
                          {mostrarHoraLegible(empresa.HorarioCierre)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {empresa.Categorias?.slice(0, 2).map(
                            (categoria, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-orus-secondary bg-opacity-20 text-orus-primary rounded-full">
                                {categoria}
                              </span>
                            )
                          )}
                          {empresa.Categorias?.length > 2 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              +{empresa.Categorias.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            empresa.activa
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {empresa.activa ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditEmpresa(empresa)}
                          className="text-orus-primary hover:text-orus-secondary mr-3">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(empresa)}
                          className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron empresas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Versión para móvil y tablet */}
          <div className="lg:hidden">
            {empresasActuales.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {empresasActuales.map((empresa) => (
                  <li key={empresa.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            {empresa.Imagenes && empresa.Imagenes.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={
                                  empresa.Imagenes[0].url || "/placeholder.svg"
                                }
                                alt={empresa.Imagenes[0].descripcion}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {empresa.Nombre}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {empresa.nit}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs text-gray-500">
                          <p>
                            {empresa.Ciudad} • {empresa.Telefono}
                          </p>
                          <p>{empresa.email}</p>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {mostrarHoraLegible(empresa.HorarioApertura)} -{" "}
                            {mostrarHoraLegible(empresa.HorarioCierre)}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {empresa.Categorias?.slice(0, 3).map(
                            (categoria, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-orus-secondary bg-opacity-20 text-orus-primary rounded-full">
                                {categoria}
                              </span>
                            )
                          )}
                          {empresa.Categorias?.length > 3 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                              +{empresa.Categorias.length - 3}
                            </span>
                          )}
                        </div>

                        <span
                          className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            empresa.activa
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {empresa.activa ? "Activa" : "Inactiva"}
                        </span>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditEmpresa(empresa)}
                          className="p-2 text-orus-primary hover:bg-gray-100 rounded-full">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(empresa)}
                          className="p-2 text-red-500 hover:bg-gray-100 rounded-full">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No se encontraron empresas
              </div>
            )}
          </div>

          {/* Paginación */}
          {filteredEmpresas.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {indexOfFirstEmpresa + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastEmpresa, filteredEmpresas.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {filteredEmpresas.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}>
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-orus-primary border-orus-primary text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}>
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}>
                      <span className="sr-only">Siguiente</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Paginación móvil simplificada */}
              <div className="flex items-center justify-between w-full sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "text-gray-300 bg-gray-100"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}>
                  Anterior
                </button>

                <span className="text-sm text-gray-700">
                  {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-300 bg-gray-100"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal para crear/editar empresa */}
      {modalOpen && (
        <EmpresaModal
          empresa={empresaActual}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEmpresa}
          categoriasDisponibles={categoriasDisponibles}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              ¿Estás seguro de que deseas eliminar la empresa "
              {empresaToDelete?.Nombre}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium flex items-center">
                <X size={16} className="mr-1" />
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium flex items-center">
                <Trash2 size={16} className="mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
