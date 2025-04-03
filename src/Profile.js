import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redireccionar
import logo from '../src/hobito.png';
import "../src/Profile.css";

// Descripción de una raza de hámster
const hamsterDescription = `The Syrian hamster, also known as the golden hamster, is one of the most common hamster breeds kept as pets. They are solitary creatures that enjoy burrowing, hoarding food, and exploring. Their gentle nature makes them great companions for those who are willing to give them the attention they need.`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redireccionar

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            
            // Si no hay token, redirige al login
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Cambié la URL para usar la IP pública de EC2
                const response = await axios.get('http://34.228.9.133:8001/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                // Manejo de errores específicos
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    localStorage.removeItem('token'); // Elimina el token inválido
                    navigate('/login'); // Redirige al login
                } else {
                    setError('Error al cargar el perfil');
                    console.error(err);
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!user) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2 className="profile-name">{user.name}</h2>
                    <p className="profile-email">{user.email}</p>
                    <p className="profile-role">{user.role}</p>
                </div>

                <div className="profile-body">
                    <div className="profile-info">
                        <div className="profile-details">
                            <h3>About Me</h3>
                            <p className="hamster-description">{hamsterDescription}</p>
                        </div>
                    </div>

                    <div className="social-media-links">
                        <h3>Social Media</h3>
                        <ul>
                            <li>
                                <a 
                                    href={`https://facebook.com/${user.socials?.facebook || '#'}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a 
                                    href={`https://twitter.com/${user.socials?.twitter || '#'}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a 
                                    href={`https://instagram.com/${user.socials?.instagram || '#'}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <button onClick={() => window.history.back()} className="back-button">
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Profile;
