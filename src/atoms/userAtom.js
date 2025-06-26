// src/atoms/userAtom.js
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Indica si el usuario ha iniciado sesión
export const isAuthenticatedAtom = atom(false);

// Almacena el token JWT recibido del backend
export const userTokenAtom = atom("");

// Almacena los datos del usuario autenticado
export const userDataAtom = atomWithStorage("userData", {}); 
