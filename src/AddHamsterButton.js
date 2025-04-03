import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select } from "@mui/material";
import axios from "axios";

const AddHamsterButton = ({ fetchHamsters }) => {
    const [open, setOpen] = useState(false); // State for dialog open/close
    const [currentHamster, setCurrentHamster] = useState({}); // State to store hamster details
    const [user_id, setUserId] = useState(""); // State for selected user ID
    const [devices, setDevices] = useState([]); // State to store devices
    const [users, setUsers] = useState([]); // State to store users

    // Fetch devices and users when the component mounts
    useEffect(() => {
        fetchDevicesAndUsers();
    }, []);

    const fetchDevicesAndUsers = async () => {
        try {
            const deviceResponse = await axios.get("http://34.228.9.133:8001/devices"); // Fetch devices
            setDevices(deviceResponse.data); // Set the devices in state

            const userResponse = await axios.get("http://34.228.9.133:8001/users"); // Fetch users
            setUsers(userResponse.data); // Set the users in state
        } catch (error) {
            console.error("Error fetching devices or users:", error); // Handle errors
            alert("Error fetching devices or users. Please try again.");
        }
    };

    const handleSave = async () => {
        // Check if all required fields are filled
        if (!currentHamster.name || !user_id || !currentHamster.device_id) {
            alert("Name, User ID, and Device ID are required.");
            return;
        }

        // Prepare the hamster data
        const hamsterData = {
            name: currentHamster.name,
            breed: currentHamster.breed || '',
            age: currentHamster.age || null,
            weight: currentHamster.weight || null,
            health_notes: currentHamster.health_notes || '',
            device_id: currentHamster.device_id,
            user_id: user_id,
        };

        try {
            await axios.post("http://34.228.9.133:8001/hamsters", hamsterData); // Send hamster data to the backend
            setOpen(false); // Close the dialog
            fetchHamsters(); // Re-fetch the hamsters to update the list
        } catch (error) {
            console.error("Error saving hamster:", error); // Handle errors
            alert("Error saving hamster. Please check the data and try again.");
        }
    };

    return (
        <>
            <Button  variant="contained" 
            color="primary" 
            size="small" onClick={() => setOpen(true)}>
                Add Hamster
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Hamster</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={currentHamster.name || ''}
                        onChange={(e) => setCurrentHamster({ ...currentHamster, name: e.target.value })}
                    />
                    <TextField
                        label="Breed"
                        fullWidth
                        margin="dense"
                        value={currentHamster.breed || ''}
                        onChange={(e) => setCurrentHamster({ ...currentHamster, breed: e.target.value })}
                    />
                    <TextField
                        label="Age"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={currentHamster.age || ''}
                        onChange={(e) => setCurrentHamster({ ...currentHamster, age: e.target.value })}
                    />
                    <TextField
                        label="Weight"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={currentHamster.weight || ''}
                        onChange={(e) => setCurrentHamster({ ...currentHamster, weight: e.target.value })}
                    />
                    <TextField
                        label="Health Notes"
                        fullWidth
                        margin="dense"
                        value={currentHamster.health_notes || ''}
                        onChange={(e) => setCurrentHamster({ ...currentHamster, health_notes: e.target.value })}
                    />

                    {/* Dropdown to select a device */}
                    <Select
    fullWidth
    value={currentHamster.device_id || ''}
    onChange={(e) => setCurrentHamster({ ...currentHamster, device_id: e.target.value })}
>
    <MenuItem value="">Select a device</MenuItem>
    {devices.length > 0 ? (
        devices.map((device) => (
            <MenuItem key={device.id} value={device.id}>
                {device.device_name || "Unnamed Device"}
            </MenuItem>
        ))
    ) : (
        <MenuItem disabled>No devices available</MenuItem>
    )}
</Select>

                    <Select
    fullWidth
    value={user_id || ''}
    onChange={(e) => setUserId(e.target.value)}
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

export default AddHamsterButton;
