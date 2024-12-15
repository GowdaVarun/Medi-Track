import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [uniqueID, setUniqueID] = useState('');
    const [role, setRole] = useState('');
    const [activeForm, setActiveForm] = useState('email'); // 'email' or 'uniqueID'
    const [loginError, setLoginError] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const navigate = useNavigate();
    const backend_url = 'http://localhost:3001';

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowAnimation(true);

        const payload = { role };
        if (activeForm === 'email') {
            payload.email = email;
            payload.password = password;
        } else {
            payload.uniqueID = uniqueID;
        }

        axios
            .post(`${backend_url}/login`, payload)
            .then(async (result) => {
                if (result.data === 'Success') {
                    localStorage.setItem('role', role);
                    if (activeForm === 'email') {
                        localStorage.setItem('email', email);
                    } else {
                        localStorage.setItem('uniqueID', uniqueID);
                        const response = await axios.get(`${backend_url}/uniquePatient`,{params: { uniqueID, role }});
                        // console.log(response);
                        localStorage.setItem('email',response.data.email);
                    }

                    if (role === 'Admin') navigate('/home');
                    else if (role === 'Patient') navigate('/patdash');
                    else if (role === 'Doctor') navigate('/docdash');
                } else {
                    setLoginError(true);
                    setShowAnimation(false);
                }
            })
            .catch((err) => {
                console.error('Login error:', err);
                setLoginError(true);
                setShowAnimation(false);
            });
    };

    const handleOTPLogin = () => {
        navigate('/otp-login'); // Logic for OTP-based login
    };

    useEffect(() => {
        if (showAnimation) {
            setTimeout(() => {
                setShowAnimation(false);
            }, 1000);
        }
    }, [showAnimation]);

    return (
        <div className="login-background">
            <div className="login-container">
                <h2 className="login-title">Welcome to MediTrack</h2>

                {/* Toggle Buttons */}
                <div className="toggle-buttons mb-4 d-flex justify-content-around">
                    <button
                        className={`btn ${activeForm === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveForm('email')}
                    >
                        Login With Email
                    </button>
                    <button
                        className={`btn ${activeForm === 'uniqueID' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveForm('uniqueID')}
                    >
                        Login With UniqueID
                    </button>
                </div>

                {/* Form Section */}
                <div className={`form-transition ${activeForm}`}>
                    <form onSubmit={handleSubmit}>
                        {activeForm === 'email' ? (
                            <>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" className="form-label"><strong>Email</strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter Email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group mb-4">
                                    <label htmlFor="uniqueID" className="form-label"><strong>Unique ID</strong></label>
                                    <input
                                        type="text"
                                        placeholder="Enter Unique ID"
                                        className="form-control"
                                        id="uniqueID"
                                        value={uniqueID}
                                        onChange={(event) => setUniqueID(event.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group mb-4">
                            <label htmlFor="role" className="form-label"><strong>Role</strong></label>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                required
                            >
                                <option value="">Select your role</option>
                                <option value="Admin">Admin</option>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>

                {/* OTP Login & Register */}
                <Link to="/register" className="btn btn-secondary w-100 mt-3">
                    Register
                </Link>
                <button onClick={handleOTPLogin} className="btn btn-outline-primary w-100 mt-3">
                    Login using OTP
                </button>

                {loginError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Incorrect Credentials! Please try again.
                    </div>
                )}

                {showAnimation && (
                    <div className="text-center mt-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <p className="mt-3 text-muted">© MediTrack</p>
            </div>
        </div>
    );
};

export default Login;
