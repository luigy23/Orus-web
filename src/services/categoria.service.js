
import axiosClient from "../lib/Axios";

const CategoriaService = {
  crear: async (nombre, token) => {
    const { data } = await axiosClient.post(
      "/api/categorias",
      { Nombre: nombre },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  obtenerTodas: async (token) => {
    const { data } = await axiosClient.get("/api/categorias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};

export default CategoriaService;
