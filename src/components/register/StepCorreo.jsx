import { Mail } from "lucide-react";

export default function StepCorreo({
  formData,
  handleChange,
  renderProgressDots,
}) {
  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          ¿Cuál es tu correo?
        </h2>
        {renderProgressDots()}
      </div>
      <div className="relative flex justify-center">
        <input
          type="email"
          value={formData.Correo}
          onChange={(e) => handleChange("Correo", e.target.value)}
          placeholder="hola@orus.com"
          className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl bg-white text-orus-gray-900 text-base sm:text-lg focus:outline-none"
        />
        <Mail
          className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-400"
          size={18}
        />
      </div>
    </div>
  );
}
