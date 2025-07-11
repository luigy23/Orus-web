// services/empresa.service.js
import axiosClient from "../lib/Axios.js";

const EmpresaService = {
  crear: async (empresa, token) => {
    try {
      const { data } = await axiosClient.post(
        "/api/empresas",
        {
          Nombre: empresa.Nombre,
          nit: empresa.nit,
          UsuarioCorreo: empresa.email,
          Telefono: empresa.Telefono,
          Ciudad: empresa.Ciudad,
          direccion: empresa.direccion,
          HorarioApertura: empresa.HorarioApertura || null,
          HorarioCierre: empresa.HorarioCierre || null,
          Categorias: empresa.Categorias || [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("❌ Error en EmpresaService.crear:", error);
      throw error;
    }
  },

  actualizar: async (empresa, token) => {
  try {
    const { id, email, Nombre, nit, Ciudad, Telefono, HorarioApertura, HorarioCierre, direccion, Categorias } = empresa;

    const { data } = await axiosClient.put(
      `/api/empresas/${id}`,
      {
        Nombre,
        nit,
        UsuarioCorreo: email,
        Telefono,
        Ciudad,
        HorarioApertura,
        HorarioCierre,
        direccion,
        Categorias: Categorias || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("❌ Error en EmpresaService.actualizar:", error);
    throw error;
  }
},


  obtenerTodas: async (token) => {
    try {
      const { data } = await axiosClient.get("/api/empresas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("❌ Error en EmpresaService.obtenerTodas:", error);
      throw error;
    }
  },
};

export default EmpresaService;
