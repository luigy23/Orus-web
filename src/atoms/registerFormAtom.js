// src/atoms/registerFormAtom.js
import { atom } from "jotai";

// Estado global del formulario de registro
export const registerFormAtom = atom({
  Nombre: "",
  Correo: "",
  Contrasena: "",
  Telefono: "",
  FechaNacimiento: "",
  Genero: "",
  ciudadId: null, // Cambiado de Ciudad a ciudadId para usar FK
});

// Estado para controlar el paso actual del formulario
export const currentStepAtom = atom(1);
