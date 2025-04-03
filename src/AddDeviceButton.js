import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select } from "@mui/material";
import axios from "axios";

const AddDeviceButton = ({ fetchDevices }) => {
    const [open, setOpen] = useState(false); // State for dialog open/close
    const [currentDevice, setCurrentDevice] = useState({}); // State to store device details
    const [users, setUsers] = useState([]); // State to store users

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userResponse = await axios.get("http://34.228.9.133:8001/users"); // Fetch users
            setUsers(userResponse.data); // Set the users in state
        } catch (error) {
            console.error("Error fetching users:", error); // Handle errors
            alert("Error fetching users. Please try again.");
        }
    };

    const handleSave = async () => {
        // Check if all required fields are filled
        if (!currentDevice.device_name || !currentDevice.location) {
            alert("Device Name and Location are required.");
            return;
        }

        // Prepare the device data
        const deviceData = {
            device_name: currentDevice.device_name,
            location: currentDevice.location || '',
            user_id: currentDevice.user_id,
        };

        try {
            await axios.post("http://34.228.9.133:8001/devices", deviceData); // Send device data to the backend
            setOpen(false); // Close the dialog
            fetchDevices(); // Re-fetch the devices to update the list
        } catch (error) {
            console.error("Error saving device:", error); // Handle errors
            alert("Error saving device. Please check the data and try again.");
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                Add Device
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Device</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Device Name"
                        fullWidth
                        margin="dense"
                        value={currentDevice.device_name || ''}
                        onChange={(e) => setCurrentDevice({ ...currentDevice, device_name: e.target.value })}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        margin="dense"
                        value={currentDevice.location || ''}
                        onChange={(e) => setCurrentDevice({ ...currentDevice, location: e.target.value })}
                    />

                    {/* Dropdown to select a user */}
                    <Select
                        fullWidth
                        value={currentDevice.user_id || ''}
                        onChange={(e) => setCurrentDevice({ ...currentDevice, user_id: e.target.value })}
                    >
                        <MenuItem value="">Select a user</MenuItem>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name || "Unnamed User"}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No users available</MenuItem>
                        )}
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">CANCEL</Button>
                    <Button onClick={handleSave} color="primary">SAVE</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddDeviceButton;
