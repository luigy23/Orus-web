import { ChevronDown } from "lucide-react";

const generos = ["Hombre", "Mujer", "Otro", "Prefiero no decirlo"];

export default function StepNacimientoGenero({
  formData,
  handleChange,
  renderProgressDots,
}) {
  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          Fecha de nacimiento
        </h2>
        {renderProgressDots()}
      </div>
      <div className="space-y-4">
        <div className="relative flex justify-center">
          <input
            type="date"
            value={formData.FechaNacimiento}
            onChange={(e) => handleChange("FechaNacimiento", e.target.value)}
            className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg focus:outline-none"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <h3 className="text-white text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-center">
            Género
          </h3>
          <div className="relative flex justify-center">
            <select
              value={formData.Genero}
              onChange={(e) => handleChange("Genero", e.target.value)}
              className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg appearance-none focus:outline-none">
              <option value="">Selecciona tu Género</option>
              {generos.map((genero) => (
                <option key={genero} value={genero}>
                  {genero}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-500"
              size={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
