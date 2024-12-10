import React from "react";
import "./landingPage.css"; // Import the CSS styles (if you have a separate CSS file)

const MediTrack = () => {
  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="container">
          <div className="logo">
            <h1>MediTrack</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#team">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
              <li><a href="#contact" className="btn btn-primary">Contact Us</a></li>
              <li><a href="#demo" className="btn btn-secondary">Book a Demo</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h2>Optimize Your Healthcare Journey</h2>
            <p className="tagline">
              Revolutionizing patient care with real-time health management software for clinics and hospitals.
            </p>
            <p>Improve efficiency, enhance patient experience, and streamline operations effortlessly.</p>
            <div className="hero-buttons">
              <a href="/login" className="login">Login</a>
              <a href="/register" className="register">Register</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="doctor-placeholder.jpg" alt="Doctor" />
            <div className="info-boxes">
              <div>Digital Health Record Access</div>
              <div>Seamless Patient Tracking</div>
              <div>Role Based Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Clinics Section */}
      <section className="trusted-clinics">
        <div className="container">
          <h2>Our Trusted Clinics & Hospitals</h2>
          <p>
            We collaborate with trusted clinics and hospitals offering specialties across pediatrics, dermatology, ENT, psychiatry, and more.
          </p>
          <div className="logos">
            <img src="https://via.placeholder.com/150" alt="Clinic Logo" />
            <img src="https://via.placeholder.com/150" alt="Clinic Logo" />
            <img src="https://via.placeholder.com/150" alt="Clinic Logo" />
            <img src="https://via.placeholder.com/150" alt="Clinic Logo" />
            <img src="https://via.placeholder.com/150" alt="Clinic Logo" />
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements">
        <div className="container">
          <h2>What We Have Achieved</h2>
          <div className="achievement-grid">
            <div className="achievement-card">
              <i className="fa-solid fa-user-md"></i>
              <h3>200+</h3>
              <p>Doctors who trust us</p>
            </div>
            <div className="achievement-card">
              <i className="fa-solid fa-clock"></i>
              <h3>1M+</h3>
              <p>People Using</p>
            </div>
            <div className="achievement-card">
              <i className="fa-solid fa-calendar-check"></i>
              <h3>50%</h3>
              <p>Reduction in Wrong Treatment</p>
            </div>
            <div className="achievement-card">
              <i className="fa-solid fa-users"></i>
              <h3>50,000+</h3>
              <p>Satisfied patients</p>
            </div>
            <div className="achievement-card">
              <i className="fa-solid fa-chart-line"></i>
              <h3>20%</h3>
              <p>Increased efficiency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "60px 20px", backgroundColor: "#f9f9f9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#333", marginBottom: "10px" }}>Our Features</h2>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "40px" }}>
            Streamlining Patient Management with Advanced Tools
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px" }}>
            {/* Feature 1 */}
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "300px", textAlign: "left", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/cloud.svg" alt="Digital Health Record" style={{ width: "50px", height: "50px" }} />
              </div>
              <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>Digital Health Record Storage</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Securely store, access, and manage patient records with cloud-enabled solutions, ensuring data safety and accessibility.
              </p>
            </div>
            {/* Feature 2 */}
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "300px", textAlign: "left", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/shield-key.svg" alt="Role-Based Access" style={{ width: "50px", height: "50px" }} />
              </div>
              <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>Role-Based Access with 24x7 Service</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Provide healthcare staff with secure, role-based access controls, supported by 24x7 availability.
              </p>
            </div>
            {/* Feature 3 */}
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "300px", textAlign: "left", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/calendar-check.svg" alt="Appointment Booking" style={{ width: "50px", height: "50px" }} />
              </div>
              <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>Effortless Appointment Booking</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Simplify scheduling with a seamless, patient-friendly appointment booking system.
              </p>
            </div>
            {/* Feature 4 */}
            <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", width: "300px", textAlign: "left", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <img src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/chart-bar.svg" alt="Analytics" style={{ width: "50px", height: "50px" }} />
              </div>
              <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px" }}>Advanced Analytics and Reports</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Gain actionable insights into patient trends and clinic performance with real-time analytics.
              </p>
            </div>
          </div>

          {/* Learn More Button */}
          <div style={{ marginTop: "40px" }}>
            <a href="#learn-more" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team">
        <div className="team-container">
          <h2>Meet Our Team</h2>
          <div className="team">
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 1" />
              <h3>Sumedh Udupa U</h3>
              <p>Developer</p>
              <p>1RV23CS252</p>
            </div>
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 2" />
              <h3>Syed Muzammil Hussaini</h3>
              <p>Developer</p>
              <p>1RV23CS263</p>
            </div>
            <div className="team-member">
              <img src="https://via.placeholder.com/150" alt="Team Member 3" />
              <h3>Varun Gowda R</h3>
              <p>Developer</p>
              <p>1RV23CS281</p>
            </div>
           
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact">
        <div className="contact-container">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out to us.</p>
          <form className="format">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default MediTrack;
