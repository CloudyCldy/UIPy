import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Hamster from "./Hamster";
import Device from "./Device";
import "./Dashboard.css";
import UserChart from "./UserChart";
import axios from "axios"; // Make sure to install axios

function Dashboard() {
    const { role } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const apiUrl = "http://54.242.77.184:8000"; // IP pública de tu EC2 con FastAPI

    useEffect(() => {
        if (role === "admin") {
            fetch(`${apiUrl}/users`)
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

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "users.xlsx");
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const deleteUser = (id) => {
        fetch(`${apiUrl}/users/${id}`, {
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

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Function to handle file upload
    const uploadExcel = () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        axios.post(`${apiUrl}/import-excel`, formData)
            .then((response) => {
                alert(response.data.message);

                // Check if insertedRows is a number and update state accordingly
                if (response.data.insertedRows > 0) {
                    // If insertedRows > 0, you can fetch the users again or update state accordingly
                    // Example of fetching users again (you could optimize this as per your needs)
                    fetch(`${apiUrl}/users`)
                        .then((response) => response.json())
                        .then((data) => setUsers(data));
                }
            })
            .catch((err) => {
                setError("Failed to upload the file.");
                console.error(err);
            });
    };

    return (
        <div className="dashboard-container">
            <h1>{role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
            {role === "admin" ? (
                <div className="admin-section">
                    <div className="top-controls">
                        <input
                            type="text"
                            placeholder="Search Users"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <div className="buttons-container">
                            <button className="btn success" onClick={downloadExcel}>Download Excel</button>
                            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} id="file-upload" hidden />
                            <label htmlFor="file-upload" className="btn primary">Select Excel File</label>
                            <button className="btn secondary" onClick={uploadExcel} disabled={!file}>
                                Upload Excel
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <h2>User List</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.rol}</td>
                                        <td>
                                            <button className="btn danger" onClick={() => deleteUser(user.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <UserChart users={users} />

                    <div className="pagination">
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={index + 1 === currentPage ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="user-section">
                    <Hamster />
                    <Device />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
