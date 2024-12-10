import React, { useState,useEffect } from "react";
import axios from "axios"
const FileDownloader = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patients,setPatients] = useState([]);
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
  }, []);

  // Fetch files for a patient
  const fetchFiles = async () => {
    if (!patientName) {
      alert("Please enter a patient name");
      return;
    }
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
      formData.append("file", selectedFile);
      formData.append("name", patientName); // Ensure `name` matches the backend's field
      
      const response = await fetch(`http://localhost:3001/api/upload`, {
        method: "POST",
        body: formData,
      });
  
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
  

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Patient Files</h1>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="patientName" style={{ marginRight: "10px" }}>
          Patient Name:
        </label>
        <input
          type="text"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient name"
          style={{ padding: "8px", fontSize: "16px", marginRight: "10px" }}
        />
        <button onClick={fetchFiles} style={{ padding: "8px 16px", fontSize: "16px" }}>
          Fetch Files
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload" style={{ marginRight: "10px" }}>
          Upload File:
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          style={{ fontSize: "16px", marginRight: "10px" }}
        />
        <button onClick={handleUpload} style={{ padding: "8px 16px", fontSize: "16px" }}>
          Upload
        </button>
      </div>

      {loading ? (
        <p>Loading files...</p>
      ) : files.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Document Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Uploaded At</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Download</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{file.uploadedAt}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
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
      ) : (
        <p>No files found for this patient.</p>
      )}
    </div>
  );
};

export default FileDownloader;
