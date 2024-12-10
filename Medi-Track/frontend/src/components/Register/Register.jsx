import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

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
  const [gender, setGender] = useState('');
  const [dob, setDOB] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [uniqueID,setUniqueID] = useState('');
  const navigate = useNavigate();
  const backend_url = 'http://localhost:3001';
  useEffect(() => {
    if (registrationSuccess && uniqueID) {
      alert(`Your Unique ID is: ${uniqueID}`);
    }
  }, [uniqueID, registrationSuccess]); 

  const handleRegisterClick = (event) => {
    event.preventDefault();
    let uniqueID;
    let registrationData = { email, password, role };

    if (role === 'Doctor' || role === 'Admin') {
      registrationData = { ...registrationData, name, specialization, location, contact };
    } else if (role === 'Patient') {
      registrationData = { ...registrationData, firstname, lastname, age, regDate, contact,dob,weight,height,gender,bloodGroup,address};
      //UNIQUE ID Generation for patient
      let newID = (firstname.substring(0, 4).toUpperCase() + dob.substring(dob.length - 4));
      console.log(newID);
      registrationData = {...registrationData,uniqueID:newID};
      setUniqueID(newID);
    }
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
    <div className="register-background">
      <div className="register-container">
        <h2 className="register-title text-primary">Register</h2>
        
        <form onSubmit={handleRegisterClick}>
          {/* Role Selection First */}
          <div className="input-group mb-3 text-start">
              <div className="label-container">
                <label htmlFor="role"><strong>Role</strong></label>
              </div>
              <div className="input-container">
                <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            {/* Show Name and Password after role selection */}

            {/* Conditional fields for Doctor */}
            {role === 'Doctor' && (
              <>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="firstname"><strong>Name</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="form-control" 
                      id="firstname" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                {/* <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="lastname"><strong>Last Name</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="form-control" 
                      id="lastname" 
                      value={lastname} 
                      onChange={(e) => setLastname(e.target.value)} 
                      required 
                    />
                  </div>
                </div> */}
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="specialization"><strong>Specialization</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Specialization" 
                      className="form-control" 
                      id="specialization" 
                      value={specialization} 
                      onChange={(e) => setSpecialization(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="location"><strong>Location</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Location" 
                      className="form-control" 
                      id="location" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="contact"><strong>Contact</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Contact" 
                      className="form-control" 
                      id="contact" 
                      value={contact} 
                      onChange={(e) => setContact(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </>
            )}

            {/* Conditional fields for Patient */}
            {role === 'Patient' && (
              <>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="firstname"><strong>First Name</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="form-control" 
                      id="firstname" 
                      value={firstname} 
                      onChange={(e) => setFirstname(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="lastname"><strong>Last Name</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="form-control" 
                      id="lastname" 
                      value={lastname} 
                      onChange={(e) => setLastname(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="age"><strong>Age</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Age" 
                      className="form-control" 
                      id="age" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="regDate"><strong>Registration Date</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Registration Date" 
                      className="form-control" 
                      id="regDate" 
                      value={regDate} 
                      onChange={(e) => setRegDate(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="gender"><strong>Gender</strong></label>
                  </div>
                  <div className="input-container">
                    <select 
                      className="form-control" 
                      id="gender" 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)} 
                      required 
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="dob"><strong>Date Of Birth</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Date Of Birth" 
                      className="form-control" 
                      id="dob" 
                      value={dob} 
                      onChange={(e) => setDOB(e.target.value)} 
                      required 
                    />
                  </div>
                </div>  
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="bloodgroup"><strong>Blood Group</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Blood Group" 
                      className="form-control" 
                      id="bloodgroup" 
                      value={bloodGroup} 
                      onChange={(e) => setBloodGroup(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="height"><strong>Height</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Height in cm" 
                      className="form-control" 
                      id="height" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="weight"><strong>Weight</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Weight in Kgs" 
                      className="form-control" 
                      id="weight" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="address"><strong>Address</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Address" 
                      className="form-control" 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="contact"><strong>Contact</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Contact" 
                      className="form-control" 
                      id="contact" 
                      value={contact} 
                      onChange={(e) => setContact(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </>
            )}

            {/* Conditional fields for Admin */}
            {role === 'Admin' && (
              <>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="firstname"><strong>Name</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      className="form-control" 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </>
            )}

            {role && (
              <>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="email"><strong>Email</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="email" 
                      placeholder="Enter Email" 
                      className="form-control" 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group mb-3 text-start">
                  <div className="label-container">
                    <label htmlFor="password"><strong>Password</strong></label>
                  </div>
                  <div className="input-container">
                    <input 
                      type="password" 
                      placeholder="Enter Password" 
                      className="form-control" 
                      id="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
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