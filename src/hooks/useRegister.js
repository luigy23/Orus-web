import { useState } from "react";
import { useAtom } from "jotai";
import { registerAtom } from "../atoms/registerAtom";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [, setRegister] = useAtom(registerAtom);
  const navigate = useNavigate();

const handleRegistration = async (formData) => {
  setIsSubmitting(true);
  setError("");
  setSuccessMessage("");

  // Transformar el payload antes de enviarlo
  const payload = {
    ...formData,
    ciudadId: parseInt(formData.Ciudad),
    Genero: formData.Genero.toUpperCase().replace(/\s/g, "_"),
  };
  delete payload.Ciudad;



  try {
    const result = await setRegister(payload);
  

    if (!result || typeof result !== "object") {
     
      setError("Respuesta inválida del servidor");
      return;
    }

    const mensaje = result.mensaje?.toLowerCase() || "";
    

    if (
      mensaje.includes("usuario") &&
      (mensaje.includes("registrado") || mensaje.includes("creado"))
    ) {
      
      setError(""); // limpia errores anteriores
      setSuccessMessage("Usuario registrado con éxito");
      setTimeout(() => navigate("/"), 1500);
    } else {
      console.warn("⚠️ mensaje no reconocido, error:", result?.error);
      setError(result?.error || "Error al registrar usuario");
    }
  } catch (err) {
  console.error("Error en el registro:", err);
  const mensaje =
    err.response?.data?.error || // ← Aquí capturas el mensaje del backend
    err.response?.data?.message ||
    "Ocurrió un error inesperado. Intenta de nuevo.";

  setError(mensaje);
}
};

  return {
    isSubmitting,
    error,
    successMessage,
    handleRegistration,
  };
};
