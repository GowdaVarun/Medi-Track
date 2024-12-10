import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Doctors.css'; // Import the CSS file

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    specialization: '',
    location: '',
    contact: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/doctors');
        if (isMounted) {
          setDoctors(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFormFieldChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3001/doctors/${selectedDoctor._id}`, formData);
      } else {
        await axios.post('http://localhost:3001/doctors', formData);
      }

      const response = await axios.get('http://localhost:3001/doctors');
      setDoctors(response.data);

      setShowForm(false);
      setIsEditMode(false);
      setSelectedDoctor(null);
      setFormData({
        email: '',
        password: '',
        name: '',
        specialization: '',
        location: '',
        contact: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditDoctor = (selectedDoctor) => {
    setFormData({
      name: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      location: selectedDoctor.location,
      contact: selectedDoctor.contact,
    });

    setSelectedDoctor(selectedDoctor);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://localhost:3001/doctors/${doctorId}`);
      setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== doctorId));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const isAdmin = localStorage.getItem('role') === 'Admin';
  const canEditDelete = isAdmin ? true : false;

  const filteredDoctors = doctors
    .filter((doctor) => doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

  return (
  <div className="page-background">
    <div className="container">
      <Link
        to={isAdmin ? '/home' : localStorage.getItem('role') === 'Patient' ? '/patdash' : '/docdash'}
        className="dashboard-button"
      >
        <button className="btn btn-primary">Dashboard</button>
      </Link>
      <h1 className="page-header">Doctor & Practitioner Records</h1>

      {isAdmin && (
        <div className="form-toggle-button">
          <button
            className="btn btn-success"
            onClick={() => setShowForm((prevShowForm) => !prevShowForm)}
          >
            {showForm ? 'Hide Form' : 'Add Doctor'}
          </button>
        </div>
      )}

      {showForm && isAdmin && (
        <div className="form-container">
          <div className="form-box">
            <h2 className="form-heading">{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h2>
            <form>
              <div className="form-input">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormFieldChange('name', e.target.value)}
                />
              </div>
              <div className="form-input">
                <label>Department:</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleFormFieldChange('specialization', e.target.value)}
                />
              </div>
              <div className="form-input">
                <label>Qualification:</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFormFieldChange('location', e.target.value)}
                />
              </div>
              <div className="form-input">
                <label>Email:</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleFormFieldChange('email', e.target.value)}
                />
              </div>
              <div className="form-input">
                <label>Password:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFormFieldChange('password', e.target.value)}
                />
              </div>
              <div className="form-input">
                <label>Contact:</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleFormFieldChange('contact', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFormSubmit}
              >
                {isEditMode ? 'Save Changes' : 'Add Doctor'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Department"
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('specialization')}>Department</th>
              <th onClick={() => handleSort('location')}>Qualification</th>
              <th onClick={() => handleSort('contact')}>Contact</th>
              {!canEditDelete && <th>Appointments</th>}
              {canEditDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.location}</td>
                <td>{doctor.contact}</td>
                {!canEditDelete &&  <td><Link to={"/appointments"} ><button className="book-appoint-button">Book Appointment</button></Link></td>}
                {canEditDelete && (
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEditDoctor(doctor)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDoctor(doctor._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default DoctorsPage;
