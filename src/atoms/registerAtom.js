    import { atom } from "jotai"
    import AuthService from "../services/auth.service.js";

    export const registerAtom = atom(null, async (get, set, formData) => {
      try {
        const data = await AuthService.register(formData);
        return data;
      } catch (error) {
        return { success: false, error: error.response?.data?.message || "Error de red al registrar" };
      }
    });
    