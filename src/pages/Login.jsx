// src/pages/Login.jsx
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <LoginForm />
      <footer className="bg-orus-primary p-4 sm:p-6 mt-auto">
        <div className="text-center">
          <p className="text-white text-base sm:text-lg mb-3">
            ¿No tienes cuenta?
          </p>
          <div className="flex justify-center">
            <a
              href="/register"
              className="inline-block bg-white text-orus-primary font-medium py-2 sm:py-2.5 px-8 sm:px-12 rounded-full text-sm sm:text-lg hover:bg-opacity-90 transition duration-200 w-[65%] sm:w-full sm:max-w-xs text-center">
              Regístrate
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
