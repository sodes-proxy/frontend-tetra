import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            if (token) {
                const decoded = decodeJWT(token);
                if (decoded && decoded.exp) {
                    const expirationTime = new Date(decoded.exp * 1000);
                    localStorage.setItem('token', token);
                    localStorage.setItem('expirationTime', expirationTime.toISOString());
                    navigate('/');
                } else {
                    console.error('Expiration time is missing from the token');
                }
            } else {
                console.error('Token is missing from the response');
            }
        } else {
            console.error('Login failed');
        }
    };

    return (
        <div className="login-container">
            <img src="/logo-trento.jpeg" alt="Business Logo" className="login-logo" />
            <div className="login-form">
                <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <input
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
                <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
