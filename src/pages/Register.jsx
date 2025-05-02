// Register.jsx
"use client";

import { useState } from "react";
import { atom, useAtom } from "jotai";
import { Mail, Eye, EyeOff, User, Phone, MapPin } from "lucide-react";
import { useRegister } from "../hooks/useRegister"; // <--- IMPORTA EL HOOK

// Átomos de Jotai para manejar el estado del formulario
const registerFormAtom = atom({
  Correo: "",
  Nombre: "",
  Telefono: "",
  Ciudad: "",
  Contrasena: "",
});

export default function RegisterPage() {
  const [formData, setFormData] = useAtom(registerFormAtom);
  const { isSubmitting, error, successMessage, handleRegistration } =
    useRegister(); // <--- USA EL HOOK
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(formData); // <--- LLAMA A LA FUNCIÓN DEL HOOK
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="mt-8 mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Registro en <span className="text-purple-700">Orus</span>
          </h1>
          <p className="text-gray-500 text-xl mt-2">Crea tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos del formulario */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-lg font-medium">
              Correo:
            </label>
            <div className="relative">
              <input
                id="email"
                name="Correo"
                type="email"
                value={formData.Correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={24} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-lg font-medium">
              Nombre:
            </label>
            <div className="relative">
              <input
                id="name"
                name="Nombre"
                type="text"
                value={formData.Nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={24} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-lg font-medium">
              Teléfono:
            </label>
            <div className="relative">
              <input
                id="phone"
                name="Telefono"
                type="tel"
                value={formData.Telefono}
                onChange={handleChange}
                placeholder="123 456 7890"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Phone size={24} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-lg font-medium">
              Ciudad:
            </label>
            <div className="relative">
              <input
                id="city"
                name="Ciudad"
                type="text"
                value={formData.Ciudad}
                onChange={handleChange}
                placeholder="Tu ciudad"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MapPin size={24} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-lg font-medium">
              Contraseña:
            </label>
            <div className="relative">
              <input
                id="password"
                name="Contrasena"
                type={showPassword ? "text" : "password"}
                value={formData.Contrasena}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-4 rounded-full text-xl transition duration-200 mt-6 disabled:opacity-70">
            {isSubmitting ? "Procesando..." : "Registrarme"}
          </button>
        </form>
      </main>

      <footer className="bg-purple-700 p-6 mt-auto">
        <div className="text-center">
          <p className="text-white text-xl mb-4">¿Ya tienes cuenta?</p>
          <a
            href="/"
            className="inline-block bg-white text-purple-700 font-medium py-3 px-12 rounded-full text-xl hover:bg-gray-100 transition duration-200">
            Iniciar Sesión
          </a>
        </div>
      </footer>
    </div>
  );
}
