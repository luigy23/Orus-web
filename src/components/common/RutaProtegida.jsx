import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, userDataAtom } from "../../atoms/userAtom";

export default function RutaProtegida({ children, soloAdmin = false }) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [userData] = useAtom(userDataAtom);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (soloAdmin && userData?.rol !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
