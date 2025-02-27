import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../src/Chart.css";
const UserChart = ({ users }) => {
    const roleCounts = users.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
    }, {});

    const data = Object.keys(roleCounts).map((role) => ({ name: role, count: roleCounts[role] }));

    return (
        <div className="chart-container">
            <h2>User Role Distribution</h2>
            <ResponsiveContainer className="responsive-container">
            <BarChart className="bar" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#c27c64" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserChart;
