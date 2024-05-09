import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTokenExpired } from '../../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequireAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (isTokenExpired()) {
            setShowToast(true); // Activar la visualización del toast
            toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => {
                    // Redirigir después de que el toast se haya cerrado
                    navigate('/login', { state: { from: location }, replace: true });
                }
            });
        }
    }, [location, navigate]);

    if (showToast) {
        // Mientras el toast está activo, no renderizar los children para evitar cambios de ruta
        return <ToastContainer />;
    }

    return (
        <>
            <ToastContainer />
            {children}
        </>
    );
};

export default RequireAuth;
