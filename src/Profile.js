import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../src/hobito.png';
import "../src/Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                setError('Error al cargar el perfil');
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

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
                    <p className="profile-role">{user.rol}</p>
                </div>
                <button onClick={() => window.history.back()} className="back-button">
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Profile;
