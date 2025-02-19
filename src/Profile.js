import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("No token found, redirecting to login.");
                    navigate("/login");
                    return;
                }

                console.log("Token:", token);

                const res = await axios.get("http://localhost:3000/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Response:", res.data);
                setUser(res.data);
            } catch (error) {
                console.error(
                    "Error fetching profile:",
                    error.response ? error.response.data : error.message
                );
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

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
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </CardContent>
        </Card>
    );
}
