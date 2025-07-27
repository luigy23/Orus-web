// src/atoms/userAtom.js
import { atomWithStorage } from "jotai/utils";

// Función para inicializar el estado de autenticación basado en localStorage/sessionStorage
const getInitialAuthState = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token; // Convierte a boolean
};

const getInitialToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
};

// Indica si el usuario ha iniciado sesión - ahora con persistencia
export const isAuthenticatedAtom = atomWithStorage("isAuthenticated", getInitialAuthState());

// Almacena el token JWT recibido del backend - ahora con persistencia
export const userTokenAtom = atomWithStorage("userToken", getInitialToken());

// Almacena los datos del usuario autenticado
export const userDataAtom = atomWithStorage("userData", {}); 
