import axiosClient from "../lib/Axios.js";

const AuthService = {
  login: async (email, password, rememberMe = false) => {
    const payload = { Correo: email, Contrasena: password, Recordar: rememberMe };

    try {
      const { data } = await axiosClient.post("/api/auth/login", payload);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("❌ Error en AuthService.login:", error);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const { data } = await axiosClient.post("/api/auth/register", formData);
      return data;
    } catch (error) {
      console.error("❌ Error en AuthService.register:", error);
      throw error;
    }
  },
};

export default AuthService;
