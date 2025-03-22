import React from "react";

const ShowPage = () => {
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <a href="/users" style={styles.link}>Users</a>
                <a href="/hamsters" style={styles.link}>Hamsters</a>
                <a href="/devices" style={styles.link}>Devices</a>
                <a href="/profile" style={styles.link}>Profile</a>
                <a href="/show" style={styles.link}>Show (This Page)</a>
            </nav>
            <div style={styles.blog}>
                <h1>Welcome to Hamstech API</h1>
                <p>This is a simple blog-style page displaying API routes.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
    },
    nav: {
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#333",
        borderRadius: "5px",
    },
    link: {
        margin: "10px",
        color: "white",
        textDecoration: "none",
        fontSize: "18px",
    },
    blog: {
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
};

export default ShowPage;
