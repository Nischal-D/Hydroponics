import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'https://hydroponics-q549.onrender.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Call refresh endpoint
                const response = await axios.post('https://hydroponics-q549.onrender.com/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Save new access token
                localStorage.setItem('access', access);

                // Update header and retry original request
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed (expired or invalid) - Logout user
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/'; // Simple redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const response = await api.post('api/token/', { username, password });
    if (response.data.access && response.data.refresh) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
};

export default api;
