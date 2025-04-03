import React, { useState, useEffect } from 'react';
import './SensorDataForm.css';

const SensorDataForm = () => {
    const [sensorData, setSensorData] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSensorData();
    }, []);

    const fetchSensorData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://3.80.117.46:8001/sensores');
            
            if (!response.ok) {
                throw new Error('Failed to load data');
            }

            const data = await response.json();
            setSensorData(data);
            setError('');
        } catch (err) {
            setError('Error connecting to the server');
        } finally {
            setIsLoading(false);
        }
    };

    // Calcular páginas
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sensorData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sensorData.length / itemsPerPage);

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="sensor-data-container">
            <h2 className="hamster-title">🐹 Stored Sensor Data 🐹</h2>

            {error && <p className="error-message">{error}</p>}
            {isLoading && <div className="hamster-loading">Loading... 🐹</div>}

            <div className="table-responsive">
                <table className="hamster-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Device ID</th>
                            <th>Temperature (°C)</th>
                            <th>Humidity (%)</th>
                            <th>Recorded At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.device_id}</td>
                                    <td>{data.temperature}°C</td>
                                    <td>{data.humidity}%</td>
                                    <td>{new Date(data.recorded_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">No data available 🐹</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {sensorData.length > itemsPerPage && (
                <div className="hamster-pagination">
                    <button 
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="hamster-page-btn"
                    >
                        Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`hamster-page-btn ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className="hamster-page-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            <div className="hamster-footer">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sensorData.length)} of {sensorData.length} entries
            </div>
        </div>
    );
};

export default SensorDataForm;
