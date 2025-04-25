import { Routes, Route, Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "./atoms/userAtom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // página protegida

export default function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}
