import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Hide "Register" and "Login" if the user is logged in and on the profile page
    const isProfilePage = location.pathname === "/profile";

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
Hamtech                
</Typography>

                {!token && !isProfilePage && (
                    <>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    </>
                )}

                {token && <Button color="inherit" component={Link} to="/profile">Profile</Button>}
                {token && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
            </Toolbar>
        </AppBar>
    );
}

export default function App() {
    return (
        <Router>
            <Navbar />
            <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Box>
        </Router>
    );
}