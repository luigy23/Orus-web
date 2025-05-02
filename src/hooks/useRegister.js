import { useState } from "react";
import { useAtom } from "jotai";
import { registerAtom } from "../atoms/registerAtom";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registerValue, setRegister] = useAtom(registerAtom);
  const navigate = useNavigate();

  const handleRegistration = async (formData) => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await setRegister(formData);
      if (result?.mensaje !== "Usuario registrado con éxito") {
        setError(result?.error || "Error al registrar usuario");
      } else {
        setSuccessMessage("Usuario registrado con éxito");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    successMessage,
    handleRegistration,
  };
};