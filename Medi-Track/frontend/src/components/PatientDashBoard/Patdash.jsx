import React from 'react';
import { Link } from 'react-router-dom';
import './Patdash.css';
import { FaUserCircle, FaPhone, FaCalendar, FaPills, FaHospital } from 'react-icons/fa'; // Added more icons

const PatientDashboard = () => {
    const navigationButtons = [
        { name: 'My Medical Records', link: '/healthrecords' },
        { name: 'Appointments', link: '/appointments' },
        { name: 'My Entries', link: '/patients' },
        { name: 'Find Doctors', link: '/doctors' },
    ];

    // Enhanced patient details with additional information
    const patientDetails = {
        name: "John Doe",
        age: 30,
        gender: "Male",
        bloodGroup: "O+",
        address: "123 Wellness Street, MediCity",
        email: "johndoe@example.com",
        contact: "+1 234 567 8900",
        emergencyContact: "+1 234 567 8900",
        lastVisit: "November 15, 2024",
        primaryPhysician: "Dr. Sarah Smith",
        allergies: "None",
        currentMedications: ["Vitamin D", "Omega-3"],
        nextAppointment: {
            date: "December 5, 2024",
            department: "General Check-up",
            doctor: "Dr. Sarah Smith",
            time: "10:30 AM"
        }
    };

    return (
        <div class="welcome-message">Welcome, [Patient Name]

        <div className="patient-dashboard-background">
            <div className="patient-dashboard-wrapper">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="patient-dashboard-header">
                        <h1>Welcome, {patientDetails.name}!</h1>
                    </div>
                    <div className="patient-button-container">
                        {navigationButtons.map((button, index) => (
                            <Link key={index} to={button.link} className="patient-dashboard-button">
                                {button.name}
                            </Link>
                        ))}
                    </div>
                    <div className="patient-logout-button-container">
                        <Link to="/login" className="patient-logout-button">Logout</Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="patient-dashboard-container">
                    {/* Patient Information Grid */}
                    <div className="patient-info-grid">
                        <div className="info-card">
                            <h3><FaUserCircle className="card-icon" /> Personal Information</h3>
                            <p><strong>Name:</strong> {patientDetails.name}</p>
                            <p><strong>Age:</strong> {patientDetails.age}</p>
                            <p><strong>Gender:</strong> {patientDetails.gender}</p>
                            <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
                        </div>
                        <div className="info-card">
                            <h3><FaPhone className="card-icon" /> Contact Details</h3>
                            <p><strong>Address:</strong> {patientDetails.address}</p>
                            <p><strong>Email:</strong> {patientDetails.email}</p>
                            <p><strong>Contact:</strong> {patientDetails.contact}</p>
                            <p><strong>Emergency Contact:</strong> {patientDetails.emergencyContact}</p>
                        </div>
                    </div>

                    {/* Medical Summary */}
                    <div className="medical-summary">
                        <h3><FaHospital className="card-icon" /> Medical Summary</h3>
                        <p><strong>Last Visit:</strong> {patientDetails.lastVisit}</p>
                        <p><strong>Primary Physician:</strong> {patientDetails.primaryPhysician}</p>
                        <p><strong>Allergies:</strong> {patientDetails.allergies}</p>
                        <p><strong>Current Medications:</strong> {patientDetails.currentMedications.join(", ")}</p>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="upcoming-appointments">
                        <h3><FaCalendar className="card-icon" /> Upcoming Appointments</h3>
                        <p><strong>Next Visit:</strong> {patientDetails.nextAppointment.date}</p>
                        <p><strong>Department:</strong> {patientDetails.nextAppointment.department}</p>
                        <p><strong>Doctor:</strong> {patientDetails.nextAppointment.doctor}</p>
                        <p><strong>Time:</strong> {patientDetails.nextAppointment.time}</p>
                    </div>
                </div>

                {/* Profile Icon */}
                <FaUserCircle className="patient-icon" />
            </div>

            {/* Footer */}
            <div className="footer">
                Contact & Support: getHelp@Medi-Track.com | © Medi-Track
            </div>
        </div>
        </div>
    );
};

export default PatientDashboard;