import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import AddDeviceButton from "./AddDeviceButton";

const Device = () => {
    const [devices, setDevices] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [formData, setFormData] = useState({
        device_name: "",
        location: "",
        user_id: "",
    });

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            // Cambié localhost:3000 por la IP de tu EC2 con FastAPI
            const response = await axios.get("http://54.242.77.184:8000/devices");
            setDevices(response.data);
        } catch (error) {
            console.error("Error fetching devices:", error);
            alert("Failed to retrieve devices. Please check your connection and try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            // Cambié localhost:3000 por la IP de tu EC2 con FastAPI
            await axios.delete(`http://54.242.77.184:8000/devices/${id}`);
            fetchDevices();
        } catch (error) {
            console.error("Error deleting device:", error);
            alert("Failed to delete the device. Please check your connection and try again.");
        }
    };

    const handleEdit = (device) => {
        setSelectedDevice(device);
        setFormData({
            device_name: device.device_name,
            location: device.location,
            user_id: device.user_id,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDevice(null);
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
            // Cambié localhost:3000 por la IP de tu EC2 con FastAPI
            await axios.put(`http://54.242.77.184:8000/devices/${selectedDevice.id}`, formData);
            fetchDevices();
            setOpen(false);
        } catch (error) {
            console.error("Error updating device:", error);
            alert("Failed to update the device. Please check your connection and try again.");
        }
    };

    return (
        <>
            <AddDeviceButton fetchDevices={fetchDevices} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow key={device.id}>
                                <TableCell>{device.id}</TableCell>
                                <TableCell>{device.user_id}</TableCell>
                                <TableCell>{device.device_name}</TableCell>
                                <TableCell>{device.location}</TableCell>
                                <TableCell>{device.created_at}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleEdit(device)}>Edit</Button>
                                    <Button color="secondary" onClick={() => handleDelete(device.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Device</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Device Name"
                        name="device_name"
                        value={formData.device_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Location"
                        name="location"
                        value={formData.location}
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

export default Device;
