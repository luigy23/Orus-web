// src/atoms/userAtom.js
import { atom } from "jotai";

// Indica si el usuario ha iniciado sesión
export const isAuthenticatedAtom = atom(false);

// Almacena el token JWT recibido del backend
export const userTokenAtom = atom("");

// Almacena los datos del usuario autenticado
export const userDataAtom = atom({});
