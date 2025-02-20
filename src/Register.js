import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, MenuItem } from "@mui/material";

export default function Register() {
    // State to store user data
    const [user, setUser] = useState({ name: "", email: "", password: "", rol: "normal" });
    
    // State to store success or error messages
    const [message, setMessage] = useState(null);
    
    // Hook for navigation between routes
    const navigate = useNavigate();

    // Handle changes in form fields
    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    // Handle form submission for registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Send user data to the backend for registration
            await axios.post("http://localhost:3000/register", user);
            
            // Display success message
            setMessage("Successful");
            
            // Redirect the user to the login page after 2 seconds
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            // Capture and display backend errors
            setMessage(error.response?.data?.message || "Failed");
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Register</Typography>
                
                {/* Display error or success message */}
                {message && <Typography color="error">{message}</Typography>}
                
                <form onSubmit={handleRegister}>
                    {/* Name field */}
                    <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} required />
                    
                    {/* Email field */}
                    <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
                    
                    {/* Password field */}
                    <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
                    
                    {/* User role selector */}
                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Role"
                        name="rol"
                        value={user.rol}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>

                    {/* Button to register the user */}
                    <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
                </form>
            </CardContent>
        </Card>
    );
}
