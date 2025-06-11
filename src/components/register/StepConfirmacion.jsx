// src/components/register/StepConfirmacion.jsx
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

export default function StepConfirmacion({
  formData,
  error,
  successMessage,
  renderProgressDots,
}) {
  const ciudadSeleccionada =
    ciudades.find((c) => c.id === formData.Ciudad)?.nombre || "";

  return (
    <div className="mt-16 sm:mt-20 space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-white text-xl sm:text-2xl font-medium mb-6 sm:mb-8">
          Confirmemos tus datos
        </h2>
        {renderProgressDots()}
      </div>
      <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
        {[
          { label: "Nombre", value: formData.Nombre },
          { label: "Correo", value: formData.Correo },
          { label: "Teléfono", value: formData.Telefono },
          { label: "Fecha de nacimiento", value: formData.FechaNacimiento },
          { label: "Ciudad", value: ciudadSeleccionada },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/10 rounded-2xl p-3 sm:p-4 w-[85%] sm:w-[80%]">
            <p className="text-white/70 text-xs sm:text-sm">{label}:</p>
            <p className="text-white text-base sm:text-lg">{value}</p>
          </div>
        ))}
      </div>
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm mx-auto w-[85%] sm:w-[80%]">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm mx-auto w-[85%] sm:w-[80%]">
          {successMessage}
        </div>
      )}
    </div>
  );
}
