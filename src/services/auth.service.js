    import axiosClient from '../lib/Axios.js';

    const AuthService = {
      login: async (email, password) => {
        try {
          const response = await axiosClient.post('/api/auth/login', {
            Correo: email,
            Contrasena: password,
          });
          return response.data;
        } catch (error) {
          // Manejo de errores centralizado
          throw error;
        }
      },
      register: async (formData) => {
        try {
          const response = await axiosClient.post('/api/auth/register', formData);
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      
    };

    export default AuthService;
    