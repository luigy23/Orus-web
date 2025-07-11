import axiosClient from "../lib/Axios";

const getCategorias = async () => {
    try {
        const response = await axiosClient.get('/api/categorias');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
}

export { getCategorias };