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

export { getEmpresas };