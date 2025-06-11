export default function StepTelefono({
  formData,
  handleChange,
  validatePhoneNumber,
  formatPhoneNumber,
  renderProgressDots,
}) {
  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          ¿Cuál es tu teléfono?
        </h2>
        {renderProgressDots()}
      </div>
      <div className="relative flex justify-center">
        <div className="flex w-[85%] sm:w-[80%]">
          <div className="flex items-center px-2 sm:px-3 bg-white rounded-l-2xl border-r">
            <img
              src="https://flagcdn.com/w40/co.png"
              alt="Colombia"
              width={20}
              height={14}
              className="inline-block"
            />
          </div>
          <input
            type="tel"
            value={formData.Telefono}
            onChange={(e) =>
              handleChange("Telefono", formatPhoneNumber(e.target.value))
            }
            placeholder="313 123 4567"
            className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-r-2xl bg-white text-orus-gray-900 text-base sm:text-lg focus:outline-none"
            maxLength="13"
          />
        </div>
        {formData.Telefono && !validatePhoneNumber(formData.Telefono) && (
          <p className="absolute top-full left-0 right-0 text-red-300 text-xs sm:text-sm mt-2 text-center">
            El teléfono debe tener 10 dígitos
          </p>
        )}
      </div>
    </div>
  );
}
