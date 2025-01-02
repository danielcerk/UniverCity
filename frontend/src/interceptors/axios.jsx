import axios from "axios";

let refresh = false;

axios.interceptors.response.use(

    resp => resp,
    async error => {

        if (error.response.status === 401 && !refresh) {
            refresh = true;

            const refreshToken = localStorage.getItem('refresh_token');

            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/token/refresh/', {
                refresh: refreshToken
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (response.status === 200) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                return axios(error.config);
            }
        }
        refresh = false;

        return Promise.reject(error);
    }
);
