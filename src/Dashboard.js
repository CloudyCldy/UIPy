import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Dashboard() {
    const { role } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const tableStyle = {
        borderCollapse: "collapse",
        width: "100%",
        marginTop: "20px"
    };

    const thStyle = {
        backgroundColor: "#343a40",
        color: "white",
        padding: "8px",
        textAlign: "left"
    };

    const tdStyle = {
        border: "1px solid #ddd",
        padding: "8px"
    };

    useEffect(() => {
        if (role === "admin") {
            fetch("http://localhost:3000/users")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch users");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUsers(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [role]);

    const deleteUser = (id) => {
        fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete user");
                }
                setUsers(users.filter((user) => user.id !== id));
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="container mt-4">
            <h1>{role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
            {role === "admin" ? (
                <div>
                    <p>Welcome, Admin! You can manage users and settings here.</p>
                    {loading ? (
                        <p>Loading users...</p>
                    ) : error ? (
                        <p className="text-danger">Error: {error}</p>
                    ) : (
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Email</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td style={tdStyle}>{user.id}</td>
                                            <td style={tdStyle}>{user.name}</td>
                                            <td style={tdStyle}>{user.email}</td>
                                            <td style={tdStyle}>{user.rol}</td>
                                            <td style={tdStyle}>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div>
                    <p>Welcome, User! View your profile and settings here.</p>
                    <img
                        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fjk--897694138222383666%2F&psig=AOvVaw2TcjYiZ0xEHV5T_WnMEZ8Q&ust=1740625435904000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCIiwupit4IsDFQAAAAAdAAAAABAE"
                        alt="User profile"
                        width="300"
                        height="300"
                    />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
