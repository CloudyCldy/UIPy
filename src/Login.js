import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginStyles.css";

export default function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(null);
    const [token, setToken] = useState(null);
    const [attempts, setAttempts] = useState(Number(localStorage.getItem("loginAttempts")) || 0);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const lockTime = localStorage.getItem("lockTime");
        if (lockTime) {
            const remainingTime = 300000 - (Date.now() - Number(lockTime));
            if (remainingTime > 0) {
                setDisabled(true);
                setTimeout(() => {
                    localStorage.removeItem("loginAttempts");
                    localStorage.removeItem("lockTime");
                    setAttempts(0);
                    setDisabled(false);
                }, remainingTime);
            } else {
                localStorage.removeItem("loginAttempts");
                localStorage.removeItem("lockTime");
                setAttempts(0);
            }
        }
    }, []);

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (disabled) return;

        if (attempts >= 3) {
            setMessage("Too many attempts. Try again in 5 minutes.");
            setDisabled(true);
            localStorage.setItem("lockTime", Date.now().toString());
            setTimeout(() => {
                localStorage.removeItem("loginAttempts");
                localStorage.removeItem("lockTime");
                setAttempts(0);
                setDisabled(false);
            }, 300000);
            return;
        }

        try {
            // Enviar los datos del usuario al backend para iniciar sesión
            const res = await axios.post(
                "http://54.242.77.184:8001/login", 
                user, 
                {
                    headers: {
                        "Content-Type": "application/json", // Especificar el tipo de contenido
                    },
                }
            );
            
            // Guardar el token en el estado y en localStorage
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            
            // Mostrar mensaje de éxito
            setMessage("Login successful! Redirecting...");
            
            // Reiniciar el contador de intentos
            localStorage.removeItem("loginAttempts");
            setAttempts(0);
        } catch (error) {
            // Incrementar el contador de intentos fallidos
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem("loginAttempts", newAttempts.toString());
            
            // Mostrar mensaje de error
            setMessage(error.response?.data?.detail || "Login failed");
        }
    };

    useEffect(() => {
        if (token) {
            // Decodificar el token para obtener el rol del usuario
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = decodedToken.role; // Corregir: usar "role" en lugar de "rol"
            
            // Redirigir al dashboard según el rol
            navigate(`/dashboard/${role}`);
        }
    }, [token, navigate]);

    const handleBack = () => {
        navigate(-1); // Navegar a la página anterior
    };

    return (
        <div className="login-wrap">
            <div className="login-html">
                <h2 className="h2">Login</h2>
                {message && <p className="error-message">{message}</p>}
                <div className="login-form">
                    <form onSubmit={handleLogin}>
                        <div className="group">
                            <input
                                type="email"
                                name="email"
                                className="input"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="group">
                            <input
                                type="password"
                                name="password"
                                className="input"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="group">
                            <button type="submit" className="button animated-button" disabled={disabled}>
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="group">
                        <button className="bac-button" onClick={handleBack}>
                            &#8592; {/* Flecha izquierda */}BACK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}