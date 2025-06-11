// src/components/register/StepCiudad.jsx
import { ChevronDown } from "lucide-react";

const ciudades = [
  { id: 1, nombre: "Bogotá" },
  { id: 2, nombre: "Medellín" },
  { id: 3, nombre: "Cali" },
  { id: 4, nombre: "Barranquilla" },
  { id: 5, nombre: "Cartagena" },
  { id: 6, nombre: "Bucaramanga" },
  { id: 7, nombre: "Pereira" },
  { id: 8, nombre: "Santa Marta" },
];

export default function StepCiudad({
  formData,
  handleChange,
  renderProgressDots,
}) {
  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          ¿En qué ciudad estás?
        </h2>
        {renderProgressDots()}
      </div>
      <div className="relative flex justify-center">
        <select
          value={formData.Ciudad}
          onChange={(e) => handleChange("Ciudad", parseInt(e.target.value))}
          className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg appearance-none focus:outline-none">
          <option value="">Selecciona tu Ciudad</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-500"
          size={18}
        />
      </div>
    </div>
  );
}
