import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../src/hobito.png';
import "../src/Profile.css";

// You can add a description of a hamster breed here
const hamsterDescription = `The Syrian hamster, also known as the golden hamster, is one of the most common hamster breeds kept as pets. They are solitary creatures that enjoy burrowing, hoarding food, and exploring. Their gentle nature makes them great companions for those who are willing to give them the attention they need.`;

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Cambié la URL para usar la IP pública de EC2
                const response = await axios.get('http://54.242.77.184:8001/profile', {
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
                            <li><a href={`https://facebook.com/${user.socials?.facebook}`} target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href={`https://twitter.com/${user.socials?.twitter}`} target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href={`https://instagram.com/${user.socials?.instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></li>
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
