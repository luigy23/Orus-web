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
    try {
        const response = await axiosClient.get(`/api/empresas/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la empresa:', error);
        throw error;
    }
}

export { getEmpresas, getEmpresaById };