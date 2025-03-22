// Register.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../src/Register.css"; // Asegúrate de que el archivo CSS esté bien enlazado

export default function Register() {
    // Estado para almacenar los datos del usuario
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "normal" });
    
    // Estado para almacenar mensajes de éxito o error
    const [message, setMessage] = useState(null);
    
    // Hook para navegar entre las rutas
    const navigate = useNavigate();

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    // Manejar el envío del formulario para registro
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Enviar los datos del usuario al backend para registrarse
            await axios.post("http://54.242.77.184:8001/register", user); // Cambié la URL a la IP pública de EC2
            
            // Mostrar mensaje de éxito
            setMessage("Registration successful!");
            
            // Redirigir al usuario a la página de inicio de sesión después de 2 segundos
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            // Capturar y mostrar errores del backend
            setMessage(error.response?.data?.detail || "Registration failed.");
        }
    };

    // Función para regresar a la página anterior
    const handleGoBack = () => {
        navigate(-1); // Redirige a la página anterior en el historial
    };

    return (
        <div className="register-wrap">
            <div className="register-html">
                <div className="register-form">
                    <h2 className="h2">Register</h2>

                    {/* Mostrar mensaje de error o éxito */}
                    {message && <p className="error-message">{message}</p>}

                    {/* Botón de regresar */}
                    <button onClick={handleGoBack} className="bac-button">Go Back</button>

                    <form onSubmit={handleRegister}>
                        {/* Campo para el nombre */}
                        <div className="group">
                            <label htmlFor="name" className="label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input"
                                value={user.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                        </div>
                        
                        {/* Campo para el correo electrónico */}
                        <div className="group">
                            <label htmlFor="email" className="label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        
                        {/* Campo para la contraseña */}
                        <div className="group">
                            <label htmlFor="password" className="label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        
                        {/* Selector de rol del usuario */}
                        <div className="group">
                            <label htmlFor="role" className="label">Role</label>
                            <select
                                id="role"
                                name="role"
                                className="input"
                                value={user.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="normal" className="normal">Normal</option>
                                <option value="admin" className="admin">Admin</option>
                            </select>
                        </div>

                        {/* Botón para registrar al usuario */}
                        <div className="group">
                            <button type="submit" className="button">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
