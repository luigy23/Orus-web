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
        <div className="mt-8 mb-10 text-center">
          <h1 className="text-3xl font-bold">
            Bienvenid<span className="text-black">@</span> a{" "}
            <span className="text-orus-primary">Orus</span>
          </h1>
          <p className="text-orus-gray-500 text-lg mt-1">Inicia Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-lg font-medium text-orus-gray-900">
              Correo:
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@orus.com"
                className="w-full px-4 py-3 rounded-lg border border-orus-gray-100 focus:outline-none focus:ring-1 focus:ring-orus-primary text-orus-gray-500 text-lg"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orus-gray-300">
                <Mail size={22} />
              </div>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <a href="#" className="text-orus-primary hover:underline text-sm">
              ¿olvidaste la contraseña?
            </a>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-lg font-medium text-orus-gray-900">
              Contraseña:
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-orus-gray-100 focus:outline-none focus:ring-1 focus:ring-orus-primary text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orus-gray-300">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
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
              className="h-4 w-4 text-orus-primary focus:ring-orus-primary border-orus-gray-100 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-orus-gray-500 text-sm">
              Recuérdame
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orus-primary hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-full text-lg transition duration-200 mt-4">
            iniciar sesión
          </button>
        </form>
      </main>

      <footer className="bg-orus-primary p-6 mt-auto">
        <div className="text-center">
          <p className="text-white text-lg mb-3">¿No tienes cuenta?</p>
          <a
            href="/register"
            className="inline-block bg-white text-orus-primary font-medium py-2.5 px-12 rounded-full text-lg hover:bg-opacity-90 transition duration-200 w-full max-w-xs">
            Regístrate
          </a>
        </div>
      </footer>
    </div>
  );
}
