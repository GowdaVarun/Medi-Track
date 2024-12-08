import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Appointments.css";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const AppointmentBooking = () => {
  const patientemail = localStorage.getItem('email');
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentDate: '',
    appointmentTime: '',
    age: '',
    gender: '',
    contactNumber: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/appointments');
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAppointmentBooking = async (e) => {
    e.preventDefault();
    const newAppointment = { ...formData, patientemail };
    try {
      await axios.post('http://localhost:3001/appointments', newAppointment, {
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedAppointments = await axios.get('http://localhost:3001/appointments');
      setAppointments(updatedAppointments.data);
      setFormData({
        patientName: '',
        appointmentDate: '',
        appointmentTime: '',
        age: '',
        gender: '',
        contactNumber: '',
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:3001/appointments/${appointmentId}`);
      const updatedAppointments = await axios.get('http://localhost:3001/appointments');
      setAppointments(updatedAppointments.data);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/appointments/${appointmentId}`, { status: newStatus });
      const updatedAppointments = await axios.get('http://localhost:3001/appointments');
      setAppointments(updatedAppointments.data);
    } catch (error) {
      console.error('Error changing appointment status:', error);
    }
  };

  const handleDashboardClick = () => {
    if (role === 'Admin') {
      navigate('/home');
    } else if (role === 'Patient') {
      navigate('/patdash');
    } else if (role === 'Doctor') {
      navigate('/docdash');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'confirmed':
        return 'green';
      case 'canceled':
        return 'red';
      case 'completed':
        return 'gray';
      default:
        return 'black';
    }
  };

  const patientUpcomingAppointments = appointments.filter((appointment) => appointment.patientemail === patientemail);
  const upcomingAppointments = appointments;
  const userAppointments = role === 'Patient' ? patientUpcomingAppointments : upcomingAppointments;

  return (
    <div className='appoint-background'>
      <RouterLink to={role === 'Admin' ? '/home' : role === 'Patient' ? '/patdash' : '/docdash'}>
        <button
          style={{
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
            border: '2px solid #1e1e1e',
            padding: '10px 15px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            outline: 'none',
            transition: 'border-color 0.3s ease-out',
            marginTop: '60px',
            marginLeft: '10px',
          }}
          onClick={handleDashboardClick}
        >
          Dashboard
        </button>
      </RouterLink>

      {role !== 'Admin' && role !== 'Doctor' && (
        <>
          <h1 style={{ textAlign: 'center', margin: '5px 0 0', color: 'white' }}>New Appointment Details</h1>
          <div className="form-container">
            <form onSubmit={handleAppointmentBooking}>
              <div className="form-row">
                <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="Patient Name" />
                <input type="text" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} placeholder="Appointment Date" />
                <input type="text" name="appointmentTime" value={formData.appointmentTime} onChange={handleInputChange} placeholder="Appointment Time" />
                <input type="text" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" />
                <input type="text" name="gender" value={formData.gender} onChange={handleInputChange} placeholder="Gender" />
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Contact Number" />
                <button type="submit" className="btn-submit">
                  {role === 'Patient' ? 'Book Appointment' : 'Add Appointment'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {role === 'Doctor' && (
        <div>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Registered Appointments</h2>
          <table className="table table-striped" style={{ color: 'white' }}>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.age}</td>
                  <td>{appointment.gender}</td>
                  <td>{appointment.contactNumber}</td>
                  <td>
                    {appointment.status === 'scheduled' && (
                      <>
                        <button className="btn btn-success" onClick={() => handleStatusChange(appointment._id, 'confirmed')}>Confirm</button>
                        <button className="btn btn-danger" onClick={() => handleStatusChange(appointment._id, 'canceled')}>Cancel</button>
                        <button className="btn btn-secondary" onClick={() => handleStatusChange(appointment._id, 'completed')}>Complete</button>
                      </>
                    )}
                    <button className="btn btn-warning" onClick={() => handleDeleteAppointment(appointment._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {role === 'Admin' && (
        <div>
          <h2 style={{ textAlign: 'center', color: 'white' }}>All Appointments</h2>
          <table className="table table-striped" style={{ color: 'white' }}>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.age}</td>
                  <td>{appointment.gender}</td>
                  <td>{appointment.contactNumber}</td>
                  <td>
                    {appointment.status === 'scheduled' && (
                      <>
                        <button className="btn btn-success" onClick={() => handleStatusChange(appointment._id, 'confirmed')}>Confirm</button>
                        <button className="btn btn-danger" onClick={() => handleStatusChange(appointment._id, 'canceled')}>Cancel</button>
                        <button className="btn btn-secondary" onClick={() => handleStatusChange(appointment._id, 'completed')}>Complete</button>
                      </>
                    )}
                    <button className="btn btn-warning" onClick={() => handleDeleteAppointment(appointment._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {role === 'Patient' && (
        <div>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Upcoming Appointments</h2>
          <table className="table table-striped" style={{ color: 'white' }}>
            <thead>
              <tr>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
