import { useAtom } from "jotai";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  currentStepAtom,
  registerFormAtom,
} from "../../atoms/registerFormAtom";
import { useRegister } from "../../hooks/useRegister";
import StepNombre from "./StepNombre";
import StepCorreo from "./StepCorreo";
import StepContrasena from "./StepContrasena";
import StepTelefono from "./StepTelefono";
import StepNacimientoGenero from "./StepNacimientoGenero";
import StepCiudad from "./StepCiudad";
import StepConfirmacion from "./StepConfirmacion";
import logo from "../../assets/logo_orus.png";

const totalSteps = 7;

export default function RegisterWrapper() {
  const [formData, setFormData] = useAtom(registerFormAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [showPassword, setShowPassword] = useState(false);
  const { isSubmitting, error, successMessage, handleRegistration } =
    useRegister();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
      6,
      10
    )}`;
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return formData.Nombre !== "" && formData.Nombre.length >= 3;
      case 2:
        return formData.Correo !== "" && formData.Correo.includes("@");
      case 3:
        return formData.Contrasena !== "" && formData.Contrasena.length >= 6;
      case 4:
        return (
          formData.Telefono !== "" && validatePhoneNumber(formData.Telefono)
        );
      case 5:
        return formData.FechaNacimiento !== "" && formData.Genero !== "";
      case 6:
        return formData.Ciudad !== "";
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleBackClick = () => {
    if (currentStep === 1) {
      window.location.href = "/";
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    handleRegistration(formData);
  };

  const renderProgressDots = () => (
    <div className="flex justify-center space-x-2 mb-6">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`w-1.5 h-1.5 rounded-full ${
            index + 1 <= currentStep ? "bg-white" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepNombre
            formData={formData}
            handleChange={handleChange}
            renderProgressDots={renderProgressDots}
          />
        );
      case 2:
        return (
          <StepCorreo
            formData={formData}
            handleChange={handleChange}
            renderProgressDots={renderProgressDots}
          />
        );
      case 3:
        return (
          <StepContrasena
            formData={formData}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            renderProgressDots={renderProgressDots}
          />
        );
      case 4:
        return (
          <StepTelefono
            formData={formData}
            handleChange={handleChange}
            validatePhoneNumber={validatePhoneNumber}
            formatPhoneNumber={formatPhoneNumber}
            renderProgressDots={renderProgressDots}
          />
        );
      case 5:
        return (
          <StepNacimientoGenero
            formData={formData}
            handleChange={handleChange}
            renderProgressDots={renderProgressDots}
          />
        );
      case 6:
        return (
          <StepCiudad
            formData={formData}
            handleChange={handleChange}
            renderProgressDots={renderProgressDots}
          />
        );
      case 7:
        return (
          <StepConfirmacion
            formData={formData}
            error={error}
            successMessage={successMessage}
            renderProgressDots={renderProgressDots}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#4B427B] to-[#1C0732]">
      <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-md mx-auto w-full">
        <div className="flex items-start justify-between mb-6 sm:mb-8 mt-4 relative">
          <button
            onClick={handleBackClick}
            className="text-white hover:text-white/80 transition-colors">
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
            <img
              src={logo || "/placeholder.svg"}
              alt="Orus Star"
              width={40}
              height={40}
              className="filter brightness-0 invert sm:w-[50px] sm:h-[50px]"
            />
          </div>
          <div className="w-5 sm:w-6"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {renderStep()}
        </div>

        <div className="mt-6 sm:mt-8 mb-4 flex justify-center">
          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canContinue()}
              className="w-[65%] sm:w-full sm:max-w-xs bg-[#2A1B4B] hover:bg-[#2A1B4B]/90 text-white font-medium py-2.5 sm:py-4 pl-3 sm:pl-6 pr-2 sm:pr-4 rounded-full text-sm sm:text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between border border-white/20">
              <span>Continuar</span>
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                <ArrowRight
                  className="text-[#2A1B4B]"
                  size={14}
                  strokeWidth={2.5}
                />
              </div>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canContinue()}
              className="w-[65%] sm:w-full sm:max-w-xs bg-white text-[#2A1B4B] font-medium py-2.5 sm:py-4 pl-3 sm:pl-6 pr-2 sm:pr-4 rounded-full text-sm sm:text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between border border-white/20">
              <span>{isSubmitting ? "Procesando..." : "Registrarme"}</span>
              <div className="w-6 h-6 sm:w-10 sm:h-10 bg-[#2A1B4B] rounded-full flex items-center justify-center">
                <ArrowRight
                  className="text-white"
                  size={14}
                  strokeWidth={2.5}
                />
              </div>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
