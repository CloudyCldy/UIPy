import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/Hamster.css";
import AddHamsterButton from "./AddHamsterButton";

const Hamster = () => {
    const [hamsters, setHamsters] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedHamster, setSelectedHamster] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        health_notes: "",
        device_id: "",
        user_id: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchHamsters();
    }, []);

    const fetchHamsters = async () => {
        try {
            const response = await axios.get("http://localhost:3000/hamsters");
            setHamsters(response.data);
        } catch (error) {
            console.error("Error fetching hamsters:", error);
            alert("Failed to retrieve hamsters. Please check your connection and try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/hamsters/${id}`);
            fetchHamsters();
        } catch (error) {
            console.error("Error deleting hamster:", error);
            alert("Failed to delete the hamster. Please check your connection and try again.");
        }
    };

    const handleEdit = (hamster) => {
        setSelectedHamster(hamster);
        setFormData({
            name: hamster.name,
            breed: hamster.breed,
            age: hamster.age,
            weight: hamster.weight,
            health_notes: hamster.health_notes,
            device_id: hamster.device_id,
            user_id: hamster.user_id,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedHamster(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:3000/hamsters/${selectedHamster.id}`, formData);
            fetchHamsters();
            setOpen(false);
        } catch (error) {
            console.error("Error updating hamster:", error);
            alert("Failed to update the hamster. Please check your connection and try again.");
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHamsters = hamsters.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(hamsters.length / itemsPerPage);

    return (
        <>
            <div className="header-container">
                <h1>Hamster List</h1>
                <AddHamsterButton fetchHamsters={fetchHamsters} />
            </div>

            <table className="hamster-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Breed</th>
                        <th>Age</th>
                        <th>Weight</th>
                        <th>Health Notes</th>
                        <th>Device ID</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHamsters.map((hamster) => (
                        <tr key={hamster.id}>
                            <td>{hamster.id}</td>
                            <td>{hamster.user_id}</td>
                            <td>{hamster.name}</td>
                            <td>{hamster.breed}</td>
                            <td>{hamster.age}</td>
                            <td>{hamster.weight}</td>
                            <td>{hamster.health_notes}</td>
                            <td>{hamster.device_id}</td>
                            <td>{hamster.created_at}</td>
                            <td>
                                <button className="hamster-edit" onClick={() => handleEdit(hamster)}>Edit</button>
                                <button className="hamster-delete" onClick={() => handleDelete(hamster.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="pagination">
                <button className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </button>
            </div>

            {open && (
                <div className="modal">
                    <h2>Edit Hamster</h2>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <input type="text" name="breed" value={formData.breed} onChange={handleChange} placeholder="Breed" />
                    <input type="text" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                    <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" />
                    <input type="text" name="health_notes" value={formData.health_notes} onChange={handleChange} placeholder="Health Notes" />
                    <input type="text" name="device_id" value={formData.device_id} onChange={handleChange} placeholder="Device ID" />
                    <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} placeholder="User ID" />
                    <button className="modal-button" onClick={handleClose}>Cancel</button>
                    <button className="modal-button" onClick={handleSubmit}>Save</button>
                </div>
            )}
        </>
    );
};

export default Hamster;
