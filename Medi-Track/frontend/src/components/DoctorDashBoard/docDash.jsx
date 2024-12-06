import React from 'react';
import { Link } from 'react-router-dom';
import './docDash.css'; // Import the CSS file

const DoctorDashboard = () => {
    const navigationButtons = [
        { name: 'Patients', link: '/patients' },
        { name: 'Medical Records', link: '/healthrecords' },
        { name: 'Appointments', link: '/appointments' },
    ];

    return (
        <div className="login-doc-background">
            <div className="login-doc-container">
                <h1 className="doc-dashboard-title">Welcome to Medi-Track Doctor Dashboard!</h1>
                <div className="doc-button-container">
                    {navigationButtons.map((button, index) => (
                        <div key={index} className="doc-dashboard-button-container">
                            <Link to={button.link} className="doc-dashboard-button">
                                {button.name}
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="doc-logout-button-container">
                    <Link to="/login" className="doc-logout-button">Logout</Link>
                </div>
                <div className="doc-footer-text">
                    <p>©️Medi-Track</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
