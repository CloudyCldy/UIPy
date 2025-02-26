import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

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
            const res = await axios.post("http://localhost:3000/login", user);
            setToken(res.data.token);
            setMessage("Login successful! Redirecting...");
            localStorage.removeItem("loginAttempts");
            setAttempts(0);
        } catch (error) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem("loginAttempts", newAttempts.toString());
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            // Decodificar el token para obtener el rol
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = decodedToken.rol; // El rol viene en el payload del token

            // Redirigir a la página del dashboard según el rol
            navigate(`/dashboard/${role}`);
        }
    }, [token, navigate]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Login</Typography>
                {message && <Typography color="error">{message}</Typography>}
                <form onSubmit={handleLogin}>
                    <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={disabled}>Login</Button>
                </form>
            </CardContent>
        </Card>
    );
}
