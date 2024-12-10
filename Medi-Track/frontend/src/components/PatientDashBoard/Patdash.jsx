import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Patdash.css';
import { FaUserCircle, FaPhone, FaCalendar, FaPills, FaHospital } from 'react-icons/fa'; // Added more icons
import axios from "axios";
const PatientDashboard = () => {
    const navigationButtons = [
        { name: 'My Medical Records', link: '/healthrecords' },
        { name: 'Appointments', link: '/appointments' },
        { name: 'My Entries', link: '/patients' },
        { name: 'Find Doctors', link: '/doctors' },
    ];
    const [patientDetails,setPatients] = useState({
        firstname: "",
        age: "",
        gender: "",
        bloodGroup: "",
        address: "",
        email: "",
        contact: "",
        emergencyContact: "",
        lastVisit: "",
        allergies: "",
        currentMedications: "",
    });
    
    useEffect(() => {
        const fetchPatients = async () => {
          try {
            const role = localStorage.getItem('role');
            const email = localStorage.getItem('email');
            let result;
            result = await axios.get('http://localhost:3001/mydetails', {
                params: { patientemail: email },
            });
            setPatients(result.data);
            console.log("patients",patientDetails);
          } catch (error) {
            console.error('Error fetching patients:', error);
          }
        };
        fetchPatients();
      }, []);
      const [myappointments, setMyAppointments] = useState({
        appointmentDate: '',
        appointmentTime: '',
        status: '',
      });

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/myappointments',{params: {patientemail: localStorage.getItem('email')},});
            setMyAppointments(response.data);
          } catch (error) {
            setError('Error fetching data');
          }
        };
    
        fetchData();
      }, []);
    return (
        <div className="welcome-message">Welcome, {patientDetails.firstname}

        <div className="patient-dashboard-background">
            <div className="patient-dashboard-wrapper">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="patient-dashboard-header">
                        <h1>Welcome, {patientDetails.firstname}!!!</h1>
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
                            <p><strong>Name:</strong> {patientDetails.firstname}</p>
                            <p><strong>Age:</strong> {patientDetails.age}</p>
                            <p><strong>Gender:</strong> {patientDetails.gender}</p>
                            <p><strong>Blood Group:</strong> {patientDetails.bloodGroup}</p>
                        </div>
                        <div className="info-card">
                            <h3><FaPhone className="card-icon" /> Contact Details</h3>
                            <p><strong>Address:</strong> {patientDetails.address}</p>
                            <p><strong>Email:</strong> {patientDetails.email}</p>
                            <p><strong>Contact:</strong> {patientDetails.contact}</p>
                        </div>
                    </div>
                    {/* Upcoming Appointments */}
                    <div className="upcoming-appointments">
                        <h3><FaCalendar className="card-icon" /> Upcoming Appointments</h3>
                        <p><strong>Next Visit:</strong> {myappointments.appointmentDate}</p>
                        {/* <p><strong>Department:</strong> {patientDetails.nextAppointment.department}</p>
                        <p><strong>Doctor:</strong> {patientDetails.nextAppointment.doctor}</p> */}
                        <p><strong>Time:</strong> {myappointments.appointmentTime}</p>
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