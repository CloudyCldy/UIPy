import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

export default function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/login", user);
            console.log("Token received:", res.data.token);
            setToken(res.data.token);
            setMessage("Login successful! Redirecting...");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    // Store token in localStorage after it's set in state
    useEffect(() => {
        if (token) {
            console.log("in toekn")
            localStorage.setItem("token", token);
            console.log(localStorage.getItem("token"))
            navigate("/profile");
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                </form>
            </CardContent>
        </Card>
    );
}