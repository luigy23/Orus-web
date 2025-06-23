// src/components/login/LoginForm.jsx
import { useState } from "react";
import { useAtom } from "jotai";
import { Mail, Eye, EyeOff } from "lucide-react";
import {
  emailAtom,
  passwordAtom,
  rememberMeAtom,
} from "../../atoms/loginFormAtom";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm() {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [rememberMe, setRememberMe] = useAtom(rememberMeAtom);
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password, rememberMe);
  };

  return (
    <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-md mx-auto w-full">
      <div className="mt-6 sm:mt-8 mb-8 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Bienvenid<span className="text-black">@</span> a{" "}
          <span className="text-orus-primary">Orus</span>
          en Proceso
        </h1>
        <p className="text-orus-gray-500 text-base sm:text-lg mt-1">
          Inicia Sesión
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 mt-2 sm:mt-4">
        {error && (
          <p className="text-red-500 text-center text-sm sm:text-base">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="email"
            className="text-base sm:text-lg font-medium text-orus-gray-900 block text-center">
            Correo:
          </label>
          <div className="relative flex justify-center">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hola@orus.com"
              className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl border border-orus-gray-100 focus:outline-none focus:ring-1 focus:ring-orus-primary text-orus-gray-500 text-base sm:text-lg"
              required
            />
            <div className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-300">
              <Mail size={18} />
            </div>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-center">
          <a
            href="#"
            className="text-orus-primary hover:underline text-xs sm:text-sm">
            ¿olvidaste la contraseña?
          </a>
        </div>

        {/* Password */}
        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="password"
            className="text-base sm:text-lg font-medium text-orus-gray-900 block text-center">
            Contraseña:
          </label>
          <div className="relative flex justify-center">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[85%] sm:w-[80%] px-3 sm:px-4 py-3 sm:py-4 rounded-2xl border border-orus-gray-100 focus:outline-none focus:ring-1 focus:ring-orus-primary text-base sm:text-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[10%] sm:right-[12%] top-1/2 transform -translate-y-1/2 text-orus-gray-300">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3 w-3 sm:h-4 sm:w-4 text-orus-primary focus:ring-orus-primary border-orus-gray-100 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-orus-gray-500 text-xs sm:text-sm">
              Recuérdame
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 sm:pt-4 flex justify-center">
          <button
            type="submit"
            className="w-[65%] sm:w-full sm:max-w-xs bg-orus-primary hover:bg-opacity-90 text-white font-medium py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-lg transition duration-200">
            iniciar sesión
          </button>
        </div>
      </form>
    </main>
  );
}
