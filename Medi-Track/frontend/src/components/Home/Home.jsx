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
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to Medi-Track Admin Dashboard!</h1>
            <div className="button-container">
                {navigationButtons.map((button, index) => (
                    <Link key={index} to={button.link} className="btn btn-primary">
                        {button.name}
                    </Link>
                ))}
            </div>
            <Link
                to="/login"
                className="btn btn-secondary logout-btn"
            >
                Logout
            </Link>
            <p className="footer-text">©️Medi-Track</p>
        </div>
    );
};

export default Dashboard;
