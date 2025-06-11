 import { atom } from "jotai";
import AuthService from "../services/auth.service.js";

export const registerAtom = atom(null, async (get, set, formData) => {
  try {
    const data = await AuthService.register(formData);
    return data;
  } catch (error) {
    console.error("Error en registerAtom:", error);
    throw error; // ❗️Propaga el error para que useRegister lo capture
  }
});
