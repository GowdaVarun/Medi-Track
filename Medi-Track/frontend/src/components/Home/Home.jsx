import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Dashboard = () => {
    const navigationButtons = [
        { name: 'Patients', link: '/patients' },
        { name: 'Doctors/Practitioners', link: '/doctors' },
        { name: 'User Management', link: '/medicaldocuments' },
        { name: 'Appointments', link: '/appointments' },
    ];

    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Welcome to Medi-Track Admin Dashboard!</h1>
            <div className="admin-button-container">
                {navigationButtons.map((button, index) => (
                    <Link key={index} to={button.link} className="admin-btn">
                        {button.name}
                    </Link>
                ))}
            </div>
            <Link
                to="/login"
                className="admin-logout-btn"
            >
                Logout
            </Link>
            <p className="footer-text">©️Medi-Track</p>
        </div>
    );
};

export default Dashboard;
