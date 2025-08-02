// src/components/register/StepCiudad.jsx
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SelectDepartamento from "../ui/SelectDepartamento.jsx";
import SelectCiudad from "../ui/SelectCiudad.jsx";

export default function StepCiudad({
  formData,
  handleChange,
  renderProgressDots,
}) {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');

  // Si ya hay una ciudadId seleccionada, necesitamos cargar el departamento correspondiente
  useEffect(() => {
    if (formData.ciudadId && !departamentoSeleccionado) {
      // Aquí podríamos cargar el departamento de la ciudad seleccionada si es necesario
      // Por ahora, permitimos que el usuario seleccione nuevamente
    }
  }, [formData.ciudadId, departamentoSeleccionado]);

  const handleDepartamentoChange = (departamentoId) => {
    setDepartamentoSeleccionado(departamentoId);
    // Reset ciudad cuando cambia el departamento
    handleChange("ciudadId", "");
  };

  const handleCiudadChange = (ciudadId) => {
    handleChange("ciudadId", ciudadId);
  };

  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          ¿En qué ciudad estás?
        </h2>
        {renderProgressDots()}
      </div>
      
      <div className="space-y-4 flex flex-col items-center">
        {/* Selector de Departamento */}
        <div className="relative w-[85%] sm:w-[80%]">
          <SelectDepartamento
            value={departamentoSeleccionado}
            onChange={handleDepartamentoChange}
            placeholder="Primero selecciona tu departamento"
            className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg appearance-none focus:outline-none"
          />
          <ChevronDown
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-orus-gray-500 pointer-events-none"
            size={18}
          />
        </div>

        {/* Selector de Ciudad */}
        <div className="relative w-[85%] sm:w-[80%]">
          <SelectCiudad
            departamentoId={departamentoSeleccionado}
            value={formData.ciudadId || ''}
            onChange={handleCiudadChange}
            placeholder={departamentoSeleccionado ? "Ahora selecciona tu ciudad" : "Primero selecciona un departamento"}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg appearance-none focus:outline-none"
          />
          <ChevronDown
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-orus-gray-500 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Indicador de selección */}
      {formData.ciudadId && (
        <div className="text-center">
          <p className="text-white/80 text-sm">
            ✅ Ciudad seleccionada correctamente
          </p>
        </div>
      )}
    </div>
  );
}
