import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Hamster from "./Hamster";
import Device from "./Device";
import "./Dashboard.css";

function Dashboard() {
    const { role } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [file, setFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // Número de usuarios por página

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

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "users.xlsx");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de paginación
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard-container">
            <h1>{role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
            {role === "admin" ? (
                <div className="admin-section">
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
                        <button className="btn secondary" disabled={!file}>Upload Excel</button>
                    </div>

                    <div className="users-table">
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
                                        <td>{user.role}</td>
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

                    {/* Paginación */}
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={index + 1 === currentPage ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
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
