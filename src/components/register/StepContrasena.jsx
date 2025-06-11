import { Eye, EyeOff } from "lucide-react";

export default function StepContrasena({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  renderProgressDots,
}) {
  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          Escoge una contraseña
        </h2>
        {renderProgressDots()}
      </div>
      <div className="relative flex justify-center">
        <input
          type={showPassword ? "text" : "password"}
          value={formData.Contrasena}
          onChange={(e) => handleChange("Contrasena", e.target.value)}
          placeholder="••••••••••••••"
          className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-400">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {formData.Contrasena && formData.Contrasena.length < 6 && (
        <p className="text-red-300 text-xs sm:text-sm text-center">
          La contraseña debe tener al menos 6 caracteres
        </p>
      )}
    </div>
  );
}
