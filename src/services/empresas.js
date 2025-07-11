import axiosClient from "../lib/Axios";


const getEmpresas = async () => {
    try {
        const response = await axiosClient.get('/api/empresas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas:', error);
        throw error;
    }
}

const getEmpresaById = async (id) => {
    console.log("getEmpresaById", id)
    try {
        const response = await axiosClient.get(`/api/empresas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la empresa:', error);
        throw error;
    }
}

const getEmpresasByCategoria = async (categoria) => {
    console.log("getEmpresasByCategoria", categoria)
    try {
        const response = await axiosClient.get(`/api/empresas/categoria/${categoria}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas por categoría:', error);
        throw error;
    }
}

export { getEmpresas, getEmpresaById, getEmpresasByCategoria };