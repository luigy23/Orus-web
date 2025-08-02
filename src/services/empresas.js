import axiosClient from "../lib/Axios";


const getEmpresas = async (params = {}) => {
    try {
        // Construir query string con los parámetros
        const queryParams = new URLSearchParams();
        
        if (params.ciudadId) {
            queryParams.append('ciudadId', params.ciudadId);
        }
        if (params.departamentoId) {
            queryParams.append('departamentoId', params.departamentoId);
        }
        if (params.busqueda) {
            queryParams.append('busqueda', params.busqueda);
        }
        
        const queryString = queryParams.toString();
        const url = queryString ? `/api/empresas?${queryString}` : '/api/empresas';
        
        const response = await axiosClient.get(url);
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

const getEmpresasByCategoria = async (categoria, params = {}) => {
    console.log("getEmpresasByCategoria", categoria, params)
    try {
        // Construir query string con los parámetros adicionales
        const queryParams = new URLSearchParams();
        
        if (params.ciudadId) {
            queryParams.append('ciudadId', params.ciudadId);
        }
        if (params.departamentoId) {
            queryParams.append('departamentoId', params.departamentoId);
        }
        if (params.busqueda) {
            queryParams.append('busqueda', params.busqueda);
        }
        
        const queryString = queryParams.toString();
        const url = queryString ? `/api/empresas/categoria/${categoria}?${queryString}` : `/api/empresas/categoria/${categoria}`;
        
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas por categoría:', error);
        throw error;
    }
}

export { getEmpresas, getEmpresaById, getEmpresasByCategoria };