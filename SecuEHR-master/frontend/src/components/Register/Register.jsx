import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [age, setAge] = useState('');
  const [regDate, setRegDate] = useState('');
  const [disease, setDisease] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const navigate = useNavigate();
  const backend_url = 'http://localhost:3001';

  const handleRegisterClick = (event) => {
    event.preventDefault();
    
    let registrationData = { name, email, password, role };

    // Add specific data based on the role
    if (role === 'Doctor') {
      registrationData = { ...registrationData, specialization, location, contact };
    } else if (role === 'Patient') {
      registrationData = { ...registrationData, firstname, lastname, age, regDate, contact };
    }

    // Send the registration request
    axios.post(`${backend_url}/register`, registrationData)
      .then(response => {
        if (response.data === 'success') {
          setRegistrationSuccess(true);
          setRegistrationError(false);
          setRegistrationFailed(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if(response.data === "Exists") {
          setRegistrationError(true);
          setRegistrationSuccess(false);
          setRegistrationFailed(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setRegistrationError(true);
          setRegistrationFailed(false);
          setRegistrationSuccess(false);
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        setRegistrationError(true);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center text-center vh-100"
      style={{
        backgroundImage: 'url("welcomebg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-3 rounded" style={{ width: '50%' }}>
        <h2 className="mb-3 text-primary">Register</h2>
        
        <form onSubmit={handleRegisterClick}>
          <div className="mb-3 text-start">
            <label htmlFor="name" className="form-label"><strong>Name</strong></label>
            <input type="text" placeholder="Enter Your Name" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label"><strong>Email</strong></label>
            <input type="email" placeholder="Enter Email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
            <input type="password" placeholder="Enter Password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="role" className="form-label"><strong>Role</strong></label>
            <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          {/* Additional fields based on role */}
          {role === 'Doctor' && (
            <>
              <div className="mb-3 text-start">
                <label htmlFor="specialization" className="form-label"><strong>Specialization</strong></label>
                <input type="text" placeholder="Specialization" className="form-control" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="location" className="form-label"><strong>Location</strong></label>
                <input type="text" placeholder="Location" className="form-control" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="contact" className="form-label"><strong>Contact</strong></label>
                <input type="text" placeholder="Contact" className="form-control" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
            </>
          )}
          {role === 'Patient' && (
            <>
              <div className="mb-3 text-start">
                <label htmlFor="firstname" className="form-label"><strong>First Name</strong></label>
                <input type="text" placeholder="First Name" className="form-control" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="lastname" className="form-label"><strong>Last Name</strong></label>
                <input type="text" placeholder="Last Name" className="form-control" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="age" className="form-label"><strong>Age</strong></label>
                <input type="text" placeholder="Age" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="regDate" className="form-label"><strong>Registration Date</strong></label>
                <input type="text" placeholder="Registration Date" className="form-control" id="regDate" value={regDate} onChange={(e) => setRegDate(e.target.value)} required />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="contact" className="form-label"><strong>Contact</strong></label>
                <input type="text" placeholder="Contact" className="form-control" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        
        {registrationSuccess && (
          <div className="alert alert-success mt-3" role="alert">
            Registration successful! Redirecting to login...
          </div>
        )}
        {registrationError && (
          <div className="alert alert-danger mt-3" role="alert">
            Registration failed. Please try again.
          </div>
        )}
        {registrationFailed && (
          <div className="alert alert-danger mt-3" role="alert">
            There is already a user with the same email and role. Redirecting to login page...
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
