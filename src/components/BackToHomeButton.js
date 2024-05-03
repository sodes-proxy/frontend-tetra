// src/components/BackToHomeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackToHomeButton.css';

const BackToHomeButton = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <button onClick={handleGoHome} className="back-home-button">
            Volver a Inicio
        </button>
    );
};

export default BackToHomeButton;