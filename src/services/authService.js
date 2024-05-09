
const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (!expirationTime) {
        return true;
    }
    return new Date() > new Date(expirationTime);
};


const handleLogout = (navigate) => {
    if (isTokenExpired()) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        navigate('/login');
    }
};

export { isTokenExpired, handleLogout };
