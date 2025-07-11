"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash2, Plus, Clock, Tag, Camera } from "lucide-react";
import CategoriaService from "../../services/categoria.service";

export default function EmpresaModal({
  empresa,
  onClose,
  onSave,
  categoriasDisponibles,
}) {
  const [formData, setFormData] = useState({
    id: null,
    Nombre: "",
    nit: "",
    direccion: "",
    Telefono: "",
    email: "",
    Ciudad: "",
    HorarioApertura: "",
    HorarioCierre: "",
    activa: true,
    Categorias: [],
    Imagenes: [],
  });

  const [errors, setErrors] = useState({});
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [showCategoriaInput, setShowCategoriaInput] = useState(false);

  // Cargar datos de la empresa si estamos editando
  useEffect(() => {
    if (empresa) {
      setFormData({
        id: empresa.id || null,
        Nombre: empresa.Nombre || "",
        nit: empresa.nit || "", // si usas nit
        direccion: empresa.direccion || "", // si usas direccion
        Telefono: empresa.Telefono || "",
        email: empresa.email || empresa.UsuarioCorreo || "",
        Ciudad: empresa.Ciudad || "",
        HorarioApertura: empresa.HorarioApertura || "",
        HorarioCierre: empresa.HorarioCierre || "",
        activa: empresa.activa ?? true,
        Categorias: empresa.Categorias || [],
        Imagenes: empresa.Imagenes || [],
      });
    }
  }, [empresa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Limpiar error cuando el usuario comienza a corregir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: event.target.result,
          descripcion: file.name,
          file: file,
        };
        setFormData((prev) => ({
          ...prev,
          Imagenes: [...prev.Imagenes, newImage],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      Imagenes: prev.Imagenes.filter((img) => img.id !== imageId),
    }));
  };

  const handleUpdateImageDescription = (imageId, descripcion) => {
    setFormData((prev) => ({
      ...prev,
      Imagenes: prev.Imagenes.map((img) =>
        img.id === imageId ? { ...img, descripcion } : img
      ),
    }));
  };

  const handleAddCategoria = (categoria) => {
    if (categoria && !formData.Categorias.includes(categoria)) {
      setFormData((prev) => ({
        ...prev,
        Categorias: [...prev.Categorias, categoria],
      }));
    }
  };

  const handleRemoveCategoria = (categoria) => {
    setFormData((prev) => ({
      ...prev,
      Categorias: prev.Categorias.filter((cat) => cat !== categoria),
    }));
  };

  const handleAddNuevaCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const nueva = await CategoriaService.crear(nuevaCategoria.trim(), token);
      handleAddCategoria(nueva.Nombre); // añade al estado
      setNuevaCategoria("");
      setShowCategoriaInput(false);
    } catch (error) {
      console.error("❌ Error al guardar nueva categoría:", error);
      alert("No se pudo guardar la nueva categoría");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Nombre.trim()) {
      newErrors.Nombre = "El nombre es obligatorio";
    }

    if (!formData.nit.trim()) {
      newErrors.nit = "El NIT es obligatorio";
    } else if (!/^[0-9.-]+$/.test(formData.nit)) {
      newErrors.nit = "Formato de NIT inválido";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    }

    if (!formData.Telefono.trim()) {
      newErrors.Telefono = "El teléfono es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.Ciudad.trim()) {
      newErrors.Ciudad = "La ciudad es obligatoria";
    }

    if (formData.HorarioApertura && formData.HorarioCierre) {
      if (formData.HorarioApertura >= formData.HorarioCierre) {
        newErrors.HorarioCierre =
          "El horario de cierre debe ser posterior al de apertura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
          <h2 className="text-lg font-medium text-gray-900">
            {empresa ? "Editar Empresa" : "Nueva Empresa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Nombre"
                className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la empresa *
              </label>
              <input
                type="text"
                id="Nombre"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.Nombre ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
              />
              {errors.Nombre && (
                <p className="mt-1 text-xs text-red-600">{errors.Nombre}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="nit"
                className="block text-sm font-medium text-gray-700 mb-1">
                NIT *
              </label>
              <input
                type="text"
                id="nit"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                placeholder="900.123.456-7"
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.nit ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
              />
              {errors.nit && (
                <p className="mt-1 text-xs text-red-600">{errors.nit}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="direccion"
              className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.direccion ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
            />
            {errors.direccion && (
              <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="Telefono"
                className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="text"
                id="Telefono"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleChange}
                placeholder="601 234 5678"
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.Telefono ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
              />
              {errors.Telefono && (
                <p className="mt-1 text-xs text-red-600">{errors.Telefono}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="Ciudad"
                className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                id="Ciudad"
                name="Ciudad"
                value={formData.Ciudad}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.Ciudad ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
              />
              {errors.Ciudad && (
                <p className="mt-1 text-xs text-red-600">{errors.Ciudad}</p>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="mr-2" size={16} />
              Horarios de Atención
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="HorarioApertura"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Horario de Apertura
                </label>
                <input
                  type="time"
                  id="HorarioApertura"
                  name="HorarioApertura"
                  value={formData.HorarioApertura}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.HorarioApertura
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
                />
                {errors.HorarioApertura && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.HorarioApertura}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="HorarioCierre"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Horario de Cierre
                </label>
                <input
                  type="time"
                  id="HorarioCierre"
                  name="HorarioCierre"
                  value={formData.HorarioCierre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.HorarioCierre ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orus-primary`}
                />
                {errors.HorarioCierre && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.HorarioCierre}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Tag className="mr-2" size={16} />
              Categorías
            </h3>

            {/* Categorías seleccionadas */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.Categorias.map((categoria, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orus-secondary bg-opacity-20 text-orus-primary rounded-full text-sm flex items-center">
                  {categoria}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategoria(categoria)}
                    className="ml-2 text-orus-primary hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            {/* Selector de categorías */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categoriasDisponibles
                .filter((cat) => !formData.Categorias.includes(cat))
                .map((categoria) => (
                  <button
                    key={categoria}
                    type="button"
                    onClick={() => handleAddCategoria(categoria)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                    + {categoria}
                  </button>
                ))}
            </div>

            {/* Agregar nueva categoría */}
            <div className="flex items-center gap-2">
              {showCategoriaInput ? (
                <>
                  <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Nueva categoría"
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orus-primary"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddNuevaCategoria()
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddNuevaCategoria}
                    className="px-3 py-1 bg-orus-primary text-white rounded-md text-sm hover:bg-opacity-90">
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoriaInput(false);
                      setNuevaCategoria("");
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCategoriaInput(true)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm flex items-center">
                  <Plus size={14} className="mr-1" />
                  Nueva categoría
                </button>
              )}
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Camera className="mr-2" size={16} />
              Imágenes de la Empresa
            </h3>

            {/* Galería de imágenes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {formData.Imagenes.map((imagen) => (
                <div key={imagen.id} className="relative group">
                  <img
                    src={imagen.url || "/placeholder.svg"}
                    alt={imagen.descripcion}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imagen.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                  <input
                    type="text"
                    value={imagen.descripcion}
                    onChange={(e) =>
                      handleUpdateImageDescription(imagen.id, e.target.value)
                    }
                    placeholder="Descripción de la imagen"
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg"
                  />
                </div>
              ))}
            </div>

            {/* Subir nuevas imágenes */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Haz clic para subir imágenes o arrastra y suelta
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF hasta 10MB
                </span>
              </label>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activa"
              name="activa"
              checked={formData.activa}
              onChange={handleChange}
              className="h-4 w-4 text-orus-primary focus:ring-orus-primary border-gray-300 rounded"
            />
            <label
              htmlFor="activa"
              className="ml-2 block text-sm text-gray-700">
              Empresa activa
            </label>
          </div>

          {/* Botones de acción */}
          <div className="border-t pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orus-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orus-primary">
              {empresa ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
