import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
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

    return (
        <>
            <AddHamsterButton fetchHamsters={fetchHamsters} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Breed</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Health Notes</TableCell>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hamsters.map((hamster) => (
                            <TableRow key={hamster.id}>
                                <TableCell>{hamster.id}</TableCell>
                                <TableCell>{hamster.user_id}</TableCell>
                                <TableCell>{hamster.name}</TableCell>
                                <TableCell>{hamster.breed}</TableCell>
                                <TableCell>{hamster.age}</TableCell>
                                <TableCell>{hamster.weight}</TableCell>
                                <TableCell>{hamster.health_notes}</TableCell>
                                <TableCell>{hamster.device_id}</TableCell>
                                <TableCell>{hamster.created_at}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleEdit(hamster)}>Edit</Button>
                                    <Button color="secondary" onClick={() => handleDelete(hamster.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Hamster</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Breed"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Health Notes"
                        name="health_notes"
                        value={formData.health_notes}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Device ID"
                        name="device_id"
                        value={formData.device_id}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="User ID"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Hamster;
