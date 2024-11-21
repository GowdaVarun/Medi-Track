import React from 'react';
import { Link } from 'react-router-dom';
import './Patdash.css';

const PatientDashboard = () => {
    const navigationButtons = [
        { name: 'My Medical Records', link: '/healthrecords' },
        { name: 'Appointments', link: '/appointments' },
        { name: 'My Entries', link: '/patients' },
        { name: 'Find Doctors', link: '/doctors' },
    ];

    return (
        <div className="patient-dashboard-background">
            <div className="patient-dashboard-container">
                <h1 className="patient-dashboard-title">Welcome to Medi-Track Patient Dashboard!</h1>
                <div className="patient-button-container">
                    {navigationButtons.map((button, index) => (
                        <Link key={index} to={button.link} className="patient-dashboard-button">
                            {button.name}
                        </Link>
                    ))}
                </div>
                <div className="patient-logout-button-container">
                    <Link to='/login' className="patient-logout-button">Logout</Link>
                </div>
                <p className="patient-footer-text">©️Medi-Track</p>
            </div>
        </div>
    );
};

export default PatientDashboard;
