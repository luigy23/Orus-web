// Utilidad para debuggear el estado de autenticación
export const debugAuthState = () => {
  console.log("🔍 === DEBUG: Estado de Autenticación ===");
  
  // Storage tradicional
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");
  
  // Storage de atoms
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userToken = localStorage.getItem("userToken");
  const userData = localStorage.getItem("userData");
  
  console.log("📦 Storage tradicional:");
  console.log("  - localStorage.token:", !!localToken);
  console.log("  - sessionStorage.token:", !!sessionToken);
  console.log("  - localStorage.user:", !!localUser);
  console.log("  - sessionStorage.user:", !!sessionUser);
  
  console.log("🛠️ Storage de atoms:");
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - userToken:", !!userToken);
  console.log("  - userData:", !!userData);
  
  console.log("✨ Tokens activos:");
  if (localToken) console.log("  - Token en localStorage:", localToken.substring(0, 20) + "...");
  if (sessionToken) console.log("  - Token en sessionStorage:", sessionToken.substring(0, 20) + "...");
  
  console.log("==========================================");
  
  return {
    localToken: !!localToken,
    sessionToken: !!sessionToken,
    localUser: !!localUser,
    sessionUser: !!sessionUser,
    atomsAuth: !!isAuthenticated,
    atomsToken: !!userToken,
    atomsUser: !!userData
  };
};

// Función para limpiar completamente el estado (útil para testing)
export const clearAllAuthState = () => {
  console.log("🧹 Limpiando todo el estado de autenticación...");
  
  // Limpiar storage tradicional
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  
  // Limpiar storage de atoms
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
  
  console.log("✅ Estado limpiado completamente");
}; 