import { isTokenExpired } from './authService'; // Asegúrate de tener esta función definida

const fetchWithAuth = async (url, options = {}) => {
    if (isTokenExpired()) {
        // Redirigir al usuario al login
        window.location.href = '/login'; // Redirección simple sin usar React Router
        return Promise.reject(new Error('Sesion expirada'));
    }

    // Añadir el token al header de autorización si está disponible
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    return fetch(url, options);
};

export default fetchWithAuth;

