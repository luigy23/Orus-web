//aquí configuramos el cliente de axios, el que vamos a usar para todas las peticiones al back

/* ejemplo:
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Timeout de 5 segundos
  withCredentials: true // Habilitar el envío de credenciales en peticiones cross-origin
});
*/


//aquí tambien se va configurar el token para las peticiones (JWT)


// axiosClient.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         // Limpiamos el token de comillas extras
//         const cleanToken = token.replace(/^"|"$/g, '');
//         config.headers.Authorization = `Bearer ${cleanToken}`;
//       }
//       return config;
//     },
//     (error) => {
//       console.error('Error en la petición:', error);
//       return Promise.reject(error);
//     }
//   );