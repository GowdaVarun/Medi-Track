import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./HealthRecords.css"; // Import a CSS file for styling

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    contact: '',
    diagnosis: '',
    treatmentPlan: '',
    medications: '',
    dateOfVisit: '',
    attendingDoctor: '',
    labResults: '',
    followUpDate: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/medical-records"
        );
        if (isMounted) {
          setRecords(response.data);
        }
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    fetchRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFormFieldChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      //fetch patients
    const fetchPatients = async () => {
      try {
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        let result;
        if (role === 'Admin'|| role === 'Doctor') {
          result = await axios.get('http://localhost:3001/patients');
        } else if (role === 'Patient') {
          result = await axios.get('http://localhost:3001/myentries', {
            params: { patientemail: email },
          });
        }
        console.log("patients in result.data",result.data);
        setPatients(result.data);
        console.log("patients in patients variable",patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
    const filteredpatient = patients.filter(
      (patient) => patient.contact === formData.contact
    );
    console.log("filtered patient[0]=> ",filteredpatient[0]);
    
    if(filteredpatient){
      if (isEditMode) {
        await axios.put(
          `http://localhost:3001/medical-records/${selectedRecord._id}`,
          {
            ...formData,
            patientName: filteredpatient[0].firstname,
          }
        );
      } else {
        await axios.post("http://localhost:3001/medical-records", {
          ...formData,
          patientName: filteredpatient[0].firstname,
        });
      }
    }else{
      console.error("Couldnot find patient with given contact number");
    }
      const response = await axios.get("http://localhost:3001/medical-records");
      setRecords(response.data);
      setShowForm(false);
      setIsEditMode(false);
      setSelectedRecord(null);
      setFormData({
        contact: '',
        diagnosis: '',
        treatmentPlan: '',
        medications: '',
        dateOfVisit: '',
        attendingDoctor: '',
        labResults: '',
        followUpDate: '',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditRecord = (selectedRecord) => {
    setFormData({
      contact: selectedRecord.contact,
      diagnosis: selectedRecord.diagnosis,
      treatmentPlan: selectedRecord.treatmentPlan,
      medications: selectedRecord.medications,
      dateOfVisit: selectedRecord.dateOfVisit,
      attendingDoctor: selectedRecord.attendingDoctor,
      labResults: selectedRecord.labResults,
      followUpDate: selectedRecord.followUpDate,
    });
    setSelectedRecord(selectedRecord);
    setIsEditMode(true);
    const fetchPatients = async () => {
      try {
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        let result;
        if (role === 'Admin'|| role === 'Doctor') {
          result = await axios.get('http://localhost:3001/patients');
        } else if (role === 'Patient') {
          result = await axios.get('http://localhost:3001/myentries', {
            params: { patientemail: email },
          });
        }
        setPatients(result.data);
        console.log("patients",result.data);
        console.log("patients",patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
      fetchPatients();
    };
    setShowForm(true);
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await axios.delete(`http://localhost:3001/medical-records/${recordId}`);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => record._id !== recordId)
      );
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  };

  return (
    <div className="medical-records-container">
      <div className="header">
        <Link
          to={
            localStorage.getItem("role") === "Admin"
              ? "/home"
              : localStorage.getItem("role") === "Patient"
              ? "/patdash"
              : "/docdash"
          }
          style={{ position: "absolute", top: "20px", left: "20px" }}
        >
          <button className="btn btn-primary">Dashboard</button>
        </Link>
      </div>

      <h1 style={{ display: "block", textAlign: "center", marginTop: "70px" }}>
        Medical Records
      </h1>

      <div className="action-buttons">
        <button
          className="btn btn-success"
          onClick={() => setShowForm((prevShowForm) => !prevShowForm)}
        >
          {showForm ? "Hide Form" : "Add Medical Record"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>
            {isEditMode ? "Edit Medical Record" : "Add New Medical Record"}
          </h2>
          <form>
            <div className="form-group">
              <label>Diagnosis:</label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) =>
                  handleFormFieldChange("diagnosis", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Treatment Plan:</label>
              <input
                type="text"
                value={formData.treatmentPlan}
                onChange={(e) =>
                  handleFormFieldChange("treatmentPlan", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Medications:</label>
              <input
                type="text"
                value={formData.medications}
                onChange={(e) =>
                  handleFormFieldChange("medications", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Date of Visit:</label>
              <input
                type="date"
                value={formData.dateOfVisit}
                onChange={(e) =>
                  handleFormFieldChange("dateOfVisit", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Attending Doctor:</label>
              <input
                type="text"
                value={formData.attendingDoctor}
                onChange={(e) =>
                  handleFormFieldChange("attendingDoctor", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Lab Results:</label>
              <input
                type="text"
                value={formData.labResults}
                onChange={(e) =>
                  handleFormFieldChange("labResults", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Follow-up Date:</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) =>
                  handleFormFieldChange("followUpDate", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Contact:</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  handleFormFieldChange("contact", e.target.value)
                }
              />
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleFormSubmit}
            >
              {isEditMode ? "Save Changes" : "Add Medical Record"}
            </button>
          </form>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>{localStorage.getItem('role') === 'Patient' ? 'Your Name' : 'Patient Name'}</th>
            <th>Diagnosis</th>
            <th>Treatment Plan</th>
            <th>Medications</th>
            <th>Date of Visit</th>
            <th>Attending Doctor</th>
            <th>Lab Results</th>
            <th>Follow-up Date</th>
            <th>{localStorage.getItem('role') !== 'Patient' && 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.patientName}</td>
              <td>{record.diagnosis}</td>
              <td>{record.treatmentPlan}</td>
              <td>{record.medications}</td>
              <td>{record.dateOfVisit}</td>
              <td>{record.attendingDoctor}</td>
              <td>{record.labResults}</td>
              <td>{record.followUpDate}</td>
              <td>{record.contact}</td>
              <td>
                {/* Conditionally render the Edit and Delete buttons based on user role */}
                {localStorage.getItem("role") !== "Patient" && (
                  <>
                    <button
                      className="btn btn-info"
                      onClick={() => handleEditRecord(record)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteRecord(record._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecords;
