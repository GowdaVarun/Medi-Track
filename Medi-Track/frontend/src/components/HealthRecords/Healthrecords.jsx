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
  const [patients, setPatients] = useState({});
  const [diseasetype, setDiseaseType] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientName,setPatientName] = useState('');
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        let result;
        if (role === 'Patient') {
          result = await axios.get('http://localhost:3001/mydetails', {
            params: { patientemail: email },
          });
        }
        setPatients(result.data);
        console.log("result.data",result.data);
        console.log("patients",patients);
        setPatientName(result.data.firstname);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
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
  
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/file/${patientName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch files for the patient");
      }
      const data = await response.json();
      setFiles(data.files || []); // Assuming response contains { files: [...] }
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files. Ensure the patient name is correct.");
    } finally {
      setLoading(false);
    }
  };
  
  // Download a specific file
  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:3001/api/file/${patientName}/${fileName}`);
      if (!response.ok) {
        throw new Error("File not found");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  };

  // Delete a specific file
  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const response = await fetch(`http://localhost:3001/api/file/${patientName}/${fileName}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      alert(`File ${fileName} deleted successfully`);

      // Remove deleted file from the state
      setFiles(files.filter((file) => file.name !== fileName));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file.");
    }
  };

  // Handle file selection for upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload a new file
  const handleUpload = async () => {
    if (!patientName || !selectedFile) {
      alert("Please enter a patient name and select a file to upload");
      return;
    }
  
    try {
      const formData = new FormData();
      console.log(selectedFile,patientName);
      
      formData.append("file", selectedFile);
      formData.append("name", patientName); // Ensure `name` matches the backend's field
      console.log("FormData contents:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
      const response = await fetch(`http://localhost:3001/api/upload`, {
        method: "POST",
        body: formData,
      });
      console.log("hi");
      
      if (!response.ok) {
        throw new Error("File upload failed");
      }
  
      const result = await response.json();
      console.log("File uploaded successfully:", result);
      alert(`File uploaded successfully for patient: ${patientName}`);
  
      // Clear form fields
      setSelectedFile(null);
  
      // Optionally refresh file list
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

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
          if (role === 'Patient') {
            result = await axios.get('http://localhost:3001/mydetails', {
              params: { patientemail: email },
            });
          }
          setPatients(result.data);
          console.log("result.data",result.data);
          console.log("patients",patients);
          setPatientName(result.data.firstname);
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      };
      fetchPatients();
      if (isEditMode) {
          await axios.put(
            `http://localhost:3001/medical-records/${selectedRecord._id}`,
            {
              ...formData,
              patientName: patientName,
            }
          );
        } else {
          await axios.post("http://localhost:3001/medical-records", {
            ...formData,
            patientName: patientName,
          });
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
        if (role === 'Patient') {
          result = await axios.get('http://localhost:3001/mydetails', {
            params: { patientemail: email },
          });
        }
        setPatients(result.data);
        console.log("result.data",result.data);
        console.log("patients",patients);
        setPatientName(result.data.firstname);
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

  const handleDiseaseTypeChange = (e) => {
    const type = e.target.value;
    setDiseaseType(type);

    // Set diseases based on disease type
    if (type === "Acute Disease") {
      setDiseases(["Flu", "Pneumonia", "Gastroenteritis"]);
    } else if (type === "Severe Disease") {
      setDiseases(["Cancer", "Heart Disease", "Chronic Kidney Disease"]);
    } else {
      setDiseases([]);
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
          <button className="btn btn-primary" style={{fontSize:"20px"}}>Dashboard</button>
        </Link>
      </div>

      <h1 style={{ display: "block", textAlign: "center", marginTop: "70px" ,color: "darkblue",fontSize: "50px"}}>
        Medical Records
      </h1>

      <div className="action-buttons">
        <button
          className="btn btn-success"
          onClick={() => setShowForm((prevShowForm) => !prevShowForm)}
          style={{fontSize:"20px", width:"15%"}}
        >
          {showForm ? "Hide Form" : "Add Medical Record"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <p>
            <h1>
            {isEditMode ? "Edit Medical Record" : "Add New Medical Record"}
            </h1>
          <form>
            <div className="form-group">
              <label>Disease Type:</label>
              <select
                value={diseasetype}
                onChange={handleDiseaseTypeChange}
              >
                <option value="" disabled>Select type</option>
                <option value="Acute Disease">Acute Disease</option>
                <option value="Severe Disease">Severe Disease</option>
              </select>
            </div>
            <div className="form-group">
              <label>Diagnosis:</label>
              <select
                value={formData.diagnosis}
                onChange={(e) =>
                  handleFormFieldChange("diagnosis", e.target.value)
                }
              >
                <option value="" disabled>Select Diagnosis</option>
                {diseases.map((disease, index) => (
                  <option key={index} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
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
            {/* <div className="form-group">
              <label>Contact:</label>
              <input
                type="date"
                value={formData.contact}
                onChange={(e) =>
                  handleFormFieldChange("contact", e.target.value)
                }
              />
            </div> */}
          </form>
          <div className="form-group">
                <label htmlFor="fileUpload" style={{ marginRight: "10px" }}>
                  Upload File:
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  style={{ fontSize: "16px", marginRight: "10px" }}
                />
                <button onClick={handleUpload} style={{marginTop:"10px", padding: "8px 16px", fontSize: "16px" ,backgroundColor:"#28a745",color: "#fff",border: "none", padding: "12px 25px",
  fontSize: "16px",  cursor: "pointer",  borderRadius: "20px"}}>
                  Upload
                </button>              
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleFormSubmit} 
            >
              {isEditMode ? "Save Changes" : "Add Medical Record"}
            </button>
          </p> 
        </div>
      )}
      <button className="get-record-button" onClick={()=> setActiveTable('table')}>Get Records</button>
      <button className="get-doc-button" onClick={() => { setActiveTable('table2'); setActiveButton('fetchfile'); }}>Get Documents</button>

      {activeTable === 'table' && ( 
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
            {localStorage.getItem('role') !== 'Patient' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.filter(record => record.patientName === patientName).map((record) => (
            <tr key={record._id}>
              <td>{record.patientName}</td>
              <td>{record.diagnosis}</td>
              <td>{record.treatmentPlan}</td>
              <td>{record.medications}</td>
              <td>{record.dateOfVisit}</td>
              <td>{record.attendingDoctor}</td>
              <td>{record.labResults}</td>
              <td>{record.followUpDate}</td>
              {localStorage.getItem('role') !== 'Patient' && (
                <td>
                  <button
                    className="btn btn-warning"
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>)}
      {activeTable === 'table2' && activeButton === 'fetchfile' && (
        <>
          <div className="get-doc-container">
          <button className="fetch-file-button"onClick={fetchFiles} style={{ padding: "8px 16px", fontSize: "16px" }}>Fetch Files</button>
          <table className="table2" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px"}}>Document Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px"}}>Uploaded At</th>
                <th style={{ border: "1px solid #ddd", padding: "8px"}}>Download</th>
                <th style={{ border: "1px solid #ddd", padding: "8px"}}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>{file.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>{file.uploadedAt}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", color: "black" }}>
                    <button
                      onClick={() => handleDownload(file.name)}
                      style={{ padding: "6px 12px", fontSize: "14px", cursor: "pointer" }}
                    >
                      Download
                    </button>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleDelete(file.name)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        backgroundColor: "red",
                        color: "white",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalRecords;
