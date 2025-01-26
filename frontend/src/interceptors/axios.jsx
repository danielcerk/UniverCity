import axios from "axios";

let refresh = false;

const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://api-univercity.vercel.app/'
      : 'http://127.0.0.1:8000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
  
  

axiosInstance.interceptors.response.use(
    resp => resp,
    async error => {
        if (error.response?.status === 401 && !refresh) {
            refresh = true;

            const refreshToken = localStorage.getItem('refresh_token');

            try {
                const response = await axiosInstance.post('/api/v1/auth/token/refresh/', {
                    refresh: refreshToken
                });

                if (response.status === 200) {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);

                    // Reenvia a requisição original
                    return axiosInstance(error.config);
                }
            } catch (refreshError) {
                console.error("Erro ao tentar fazer refresh do token", refreshError);
                return Promise.reject(refreshError);
            }
        }

        refresh = false;
        return Promise.reject(error);
    }
);

export default axiosInstance;
