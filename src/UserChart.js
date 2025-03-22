import React from "react";
import "../src/Chart.css";

const UserChart = ({ users }) => {
    const roleCounts = users.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
    }, {});

    const totalUsers = users.length;
    const data = Object.keys(roleCounts).map((role) => ({
        name: role,
        percentage: (roleCounts[role] / totalUsers) * 100,
    }));

    return (
        <div className="chart-container">
            <h2>User Role Distribution</h2>
            <div className="pie-container">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={`pie animate`}
                        style={{
                            "--p": item.percentage,
                            "--c": "#6f4f1f",  // Café
                        }}
                    >
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserChart;
