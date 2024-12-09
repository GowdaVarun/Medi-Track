import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticlesComponent from '../particles/particles.jsx';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const navigate = useNavigate();
    const backend_url = 'http://localhost:3001';

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowAnimation(true);

        axios
            .post(`${backend_url}/login`, { email, password, role })
            .then((result) => {
                if (result.data === 'Success') {
                    localStorage.setItem('role', role);
                    localStorage.setItem('email', email);
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
        // Logic for OTP-based login
        navigate('/otp-login'); // Assuming you have an OTP login page
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
            {/* /<ParticlesComponent id="particles"/> */}
            <div className="login-container">
                <h2 className="login-title">Welcome to MediTrack</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="email" className="form-label"><strong>Email</strong></label>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                        <div>
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
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="role" className="form-label"><strong>Role</strong></label>
                        <div>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                            >
                                <option value="">Select your role</option>
                                <option value="Admin">Admin</option>
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
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
