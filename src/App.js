import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import "./App.css"; // Incluyendo el archivo CSS para los estilos personalizados
import logo from '../src/logo.png';


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isProfilePage = location.pathname === "/profile";

    return (
        <div className="navbar">
<img src={logo} alt="Logo" className="logo" />
<h1 className="navbar-title">Hamtech</h1>
            <div className="navbar-links">
                {!token && !isProfilePage && (
                    <>
                        <Link className="navbar-link" to="/register">Register</Link>
                        <Link className="navbar-link" to="/login">Login</Link>
                    </>
                )}
                {token && <Link className="navbar-link" to="/profile">Profile</Link>}
                {token && <button className="navbar-button" onClick={handleLogout}>Logout</button>}
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
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard/:role" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}
