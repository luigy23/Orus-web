// src/services/usuarios.service.js
import axiosClient from "../lib/Axios";

const UsuariosService = {
  // Obtener todos los usuarios
  getUsuarios: async () => {
    try {
      const { data } = await axiosClient.get("/api/usuarios");
      return data;
    } catch (error) {
      console.error("❌ Error en UsuariosService.getUsuarios:", error);
      throw error;
    }
  },

  // Obtener usuario por correo
  getUsuarioPorCorreo: async (correo) => {
    try {
      const { data } = await axiosClient.get(`/api/usuarios/${correo}`);
      return data;
    } catch (error) {
      console.error("❌ Error en UsuariosService.getUsuarioPorCorreo:", error);
      throw error;
    }
  },

  // Crear nuevo usuario
  crearUsuario: async (userData) => {
    try {
      const { data } = await axiosClient.post("/api/usuarios", userData);
      return data;
    } catch (error) {
      console.error("❌ Error en UsuariosService.crearUsuario:", error);
      throw error;
    }
  },

  // Actualizar usuario
  actualizarUsuario: async (correo, userData) => {
    try {
      const { data } = await axiosClient.put(`/api/usuarios/${correo}`, userData);
      return data;
    } catch (error) {
      console.error("❌ Error en UsuariosService.actualizarUsuario:", error);
      throw error;
    }
  },

  // Eliminar usuario
  eliminarUsuario: async (correo) => {
    try {
      const { data } = await axiosClient.delete(`/api/usuarios/${correo}`);
      return data;
    } catch (error) {
      console.error("❌ Error en UsuariosService.eliminarUsuario:", error);
      throw error;
    }
  },
};

export default UsuariosService;
