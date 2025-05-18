import { useState } from "react";
import { atom, useAtom } from "jotai";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const emailAtom = atom("");
const passwordAtom = atom("");
const rememberMeAtom = atom(false);

export default function LoginPage() {
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
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="mt-8 mb-12 text-center">
          <h1 className="text-4xl font-bold">
            Bienvenid<span className="text-black">@</span> a{" "}
            <span className="text-purple-700">Orus</span>
          </h1>
          <p className="text-gray-500 text-xl mt-2">Inicia Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xl font-medium">
              Correo:
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@orus.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={24} />
              </div>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <a href="#" className="text-purple-700 hover:underline">
              ¿olvidaste la contraseña?
            </a>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xl font-medium">
              Contraseña:
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-600">
              Recuérdame
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-4 rounded-full text-xl transition duration-200">
            Iniciar sesión
          </button>
        </form>
      </main>

      <footer className="bg-purple-700 p-6 mt-auto">
        <div className="text-center">
          <p className="text-white text-xl mb-4">¿No tienes cuenta?</p>
          <a
            href="/register"
            className="inline-block bg-white text-purple-700 font-medium py-3 px-12 rounded-full text-xl hover:bg-gray-100 transition duration-200">
            Regístrate
          </a>
        </div>
      </footer>
    </div>
  );
}
