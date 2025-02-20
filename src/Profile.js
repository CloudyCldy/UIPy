import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

export default function Profile() {
    const [user, setUser] = useState(null); // State to store user data
    const navigate = useNavigate(); // Hook for programmatic navigation

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                if (!token) {
                    console.warn("No token found, redirecting to login.");
                    navigate("/login"); // Redirect to login if no token is found
                    return;
                }

                console.log("Token:", token); // Debugging: log token

                const res = await axios.get("http://localhost:3000/profile", {
                    headers: { Authorization: `Bearer ${token}` }, // Send token in authorization header
                });

                console.log("Response:", res.data); // Debugging: log API response
                setUser(res.data); // Update user state with fetched data
            } catch (error) {
                console.error(
                    "Error fetching profile:",
                    error.response ? error.response.data : error.message
                );
                localStorage.removeItem("token"); // Remove invalid token
                navigate("/login"); // Redirect to login on error
            }
        };

        fetchProfile();
    }, [navigate]); // Effect runs on component mount

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">User Profile</Typography>
                {user ? (
                    <>
                        <Typography>
                            <strong>Name:</strong> {user.name}
                        </Typography>
                        <Typography>
                            <strong>Email:</strong> {user.email}
                        </Typography>
                        <Typography>
                            <strong>Role:</strong> {user.rol}
                        </Typography>
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </CardContent>
        </Card>
    );
}
