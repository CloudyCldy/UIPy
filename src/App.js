import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import "./App.css"; 
import Blog from "./Blog";  // Importa el componente Blog
import logo from '../src/hobito.png';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [showDropdown, setShowDropdown] = useState(false); // Estado para mostrar/ocultar el dropdown

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isProfilePage = location.pathname === "/profile";

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    return (
        <div className="navbar">
            <div className="logo-container">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="logo" 
                    onClick={toggleDropdown} // Al hacer clic en el logo, alterna el dropdown
                />
                <div 
                    className={`options-dropdown ${showDropdown ? "show" : ""}`} // Si showDropdown es true, se muestra el dropdown
                    onClick={closeDropdown} // Cierra el dropdown al hacer clic dentro de él
                >
                    {token && !isProfilePage && (
                        <Link className="navbar-link" to="/profile" onClick={closeDropdown}>Profile</Link>
                    )}
                    {token && <button className="navbar-button" onClick={handleLogout}>Logout</button>}
                </div>
            </div>
            <Link to="/" className="navbar-title-link">
                <h1 className="navbar-title">Hamtech</h1> {/* Haciendo clic aquí lleva al blog */}
            </Link>
            <div className="navbar-links">
                {!token && !isProfilePage && (
                    <>
                        <Link className="navbar-link" to="/register">Register</Link>
                        <Link className="navbar-link" to="/login">Login</Link>
                    </>
                    
                )}
                {token && !isProfilePage && (
                    <Link className="profile-button" to="/profile" onClick={closeDropdown}>
                        P
                    </Link>
                )}

                
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                <Route path="/" element={<Blog />} /> {/* Ruta por defecto */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard/:role" element={<Dashboard />} />

                </Routes>
            </div>
        </Router>
    );
}
