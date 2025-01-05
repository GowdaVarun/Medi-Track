import React, { useState } from 'react';
import axios from 'axios';
import './findmyID.css'; // Optional for styling

const FindmyID = () => {
    const [email, setEmail] = useState('');
    const [uniqueID, setUniqueID] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const backend_url = 'http://localhost:3001';

    const handleFindUniqueSubmit = async (event) => {
        event.preventDefault();
        setUniqueID(null);
        setError('');
        setLoading(true);

        try {
            const response = await axios.get(`${backend_url}/findUniqueID`, {
                params: { email },
            });
            if (response.data.uniqueID) {
                setUniqueID(response.data.uniqueID);
            } else {
                setError('Unique ID not found. Please check your email.');
            }
        } catch (error) {
            console.error('Error fetching unique ID:', error);
            setError('Unique ID not found. Please check your email or Register.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <div className="find-my-id-container">
                <h2 className="find-my-id-title">Find Your Unique ID</h2>
                <form onSubmit={handleFindUniqueSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="email" className="form-label"><strong>Email Address</strong></label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Searching...' : 'Find My ID'}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}
                {error && (
                    <button className="btn btn-secondary mt-3" onClick={() => window.location.href = '/register'}>
                        Register
                    </button>
                )}

                {uniqueID && (
                    <div className="alert alert-success mt-3" role="alert">
                        Your Unique ID: <strong>{uniqueID}</strong>
                    </div>
                )}

                {uniqueID && (
                    <button className="btn btn-secondary mt-3" onClick={() => window.location.href = '/login'}>
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default FindmyID;
