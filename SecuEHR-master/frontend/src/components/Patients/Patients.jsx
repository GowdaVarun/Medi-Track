import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    age: '',
    regDate: '',
    contact: '',
    role: 'Patient',
    disease: '', 
  });
  const [editablePatientId, setEditablePatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  
  const handleSave = async (id) => {
    console.log(`Saving patient with ID: ${id}`);
    setEditablePatientId(null);
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
      
    // Find the patient to be edited in the local state
    const editedPatient = patients.find((patient) => patient._id === id);

    try {
      // Make the PUT request to update the patient in the backend
      await axios.put(`http://localhost:3001/patients/${id}`, editedPatient);
     
      // Fetch the updated list of patients after editing
      if(role==='Patient'){
        const result = await axios.get('http://localhost:3001/myentries');
        setPatients(result.data);
      }else{
        const result = await axios.get('http://localhost:3001/patients');
        setPatients(result.data);
      }
    } catch (error) {
      console.error('Error editing patient:', error);
    }
  };
  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
  
    fetchPatients();
  }, []);
  
  const handleAddPatient = async () => {
    try {
      const role = localStorage.getItem('role');
      if (role === 'Patient') {
        const patientDetails = { ...patients, disease: newPatient.disease };
        await axios.put(`http://localhost:3001/patients/${patients._id}`, patientDetails);
      } else {//admin
        await axios.post('http://localhost:3001/patients', newPatient);
      }
  
      setShowAddPatientForm(false);
      fetchPatients(); // Refresh the patients list
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const handleEdit = (id) => {
    console.log(`Editing patient with ID: ${id}`);
    setEditablePatientId(id);
  };


  const handleDelete = async (id) => {
    console.log(`Deleting patient with ID: ${id}`);
    const role = localStorage.getItem('role');  
    if(role=='Admin' || role === 'Doctor'){
      try {
        await axios.delete(`http://localhost:3001/patients/${id}`);
        const result = await axios.get('http://localhost:3001/patients');
        setPatients(result.data);
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }else{
      const patientDetails = { ...newPatient, disease: '' };  
      try {
        await axios.put(`http://localhost:3001/patients/${id}`,patientDetails);
        const result = await axios.get('http://localhost:3001/myentries');
        setPatients(result.data);
      } catch (error) {
        console.error('Error deleting disease:', error);
      }
    }
  };

  const navigate = useNavigate();

  // Filter patients by name based on the search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        background: 'linear-gradient(45deg, #654321, #3e2723)',
        minHeight: '110vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Link
        to={
          localStorage.getItem('role') === 'Admin'
            ? '/home'
            : localStorage.getItem('role') === 'Patient'
            ? '/patdash'
            : '/docdash'
        }
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        <button className="btn btn-primary">Dashboard</button>
      </Link>
      {localStorage.getItem('role') !== 'Doctor'? (
      <h2 className="text-center mb-3" style={{ color: 'white' }}>
        Patient Records
      </h2>):(<h2></h2>)}
      {localStorage.getItem('role') === 'Admin' ? (
        // admin role
      <div
        className="mb-4 p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          width: '80%',
          overflowX: 'auto',
        }}
      >
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Add Patient</h3>
        {showAddPatientForm && (
          <div className="row">
            <div className="col">
              <input
                type="text"
                value={newPatient.firstname}
                onChange={(e) => setNewPatient({ ...newPatient, firstname: e.target.value })}
                placeholder="First Name"
                className="form-control mb-3"
              />
              <input
                type="text"
                value={newPatient.lastname}
                onChange={(e) => setNewPatient({ ...newPatient, lastname: e.target.value })}
                placeholder="Last Name"
                className="form-control mb-3"
              />
              <input
                type="text"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                placeholder="Age"
                className="form-control mb-3"
              />
            </div>
            <input
                type="text"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="Email"
                className="form-control mb-3"
              />
              <input
                type="password"
                value={newPatient.password}
                onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                placeholder="Password"
                className="form-control mb-3"
              />
            <div className="col">
              <input
                type="text"
                value={newPatient.regDate}
                onChange={(e) => setNewPatient({ ...newPatient, regDate: e.target.value })}
                placeholder="Reg. Date(DD/MM/YYYY)"
                className="form-control mb-3"
              />
              <input
                type="text"
                value={newPatient.contact}
                onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                placeholder="Contact"
                className="form-control mb-3"
              />
              <input
                type="text"
                value={newPatient.disease}
                onChange={(e) => setNewPatient({ ...newPatient, disease: e.target.value })}
                placeholder="Diagnosis"
                className="form-control mb-3"
              />
            </div>
          </div>
        )}
        <button onClick={() => setShowAddPatientForm((prev) => !prev)} className="btn btn-primary" style={{ width: '100%' }}>
          {showAddPatientForm ? 'Cancel' : 'Add Patient Record'}
        </button>
        {showAddPatientForm && (
          <button onClick={handleAddPatient} className="btn btn-primary mt-3" style={{ width: '100%' }}>
            Add Patient
          </button>
        )}
      </div>) : localStorage.getItem('role') === 'Patient'
            ? (
        //patient role
      <div
      className="mb-4 p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        width: '80%',
        overflowX: 'auto',
      }}
      >
      <h3 style={{ color: 'white', marginBottom: '20px' }}>Add Symptoms</h3>
      {showAddPatientForm && (
        <div className="row">
          <div className="col">
            <input
              type="text"
              value={patients.firstname}
              placeholder="First Name"
              className="form-control mb-3"
              readOnly
            />
            <input
              type="text"
              value={patients.lastname}
              placeholder="Last Name"
              className="form-control mb-3"
              readOnly
            />
            <input
              type="text"
              value={patients.age}
              placeholder="Age"
              className="form-control mb-3"
              readOnly
            />
          </div>
          <div className="col">
            <input
              type="text"
              value={patients.regDate}
              placeholder="Reg. Date(DD/MM/YYYY)"
              className="form-control mb-3"
              readOnly
            />
            <input
              type="text"
              value={patients.contact}
              placeholder="Contact"
              className="form-control mb-3"
              readOnly
            />
            <input
              type="text"
              value={patients.email}
              placeholder="Email"
              className="form-control mb-3"
            />
            <input
              type="text"
              value={patients.password}
              placeholder="Password"
              className="form-control mb-3"
            />
            <input
              type="text"
              value={patients.disease}
              onChange={(e) => setNewPatient({ ...patients, disease: e.target.value })}
              placeholder="Diagnosis"
              className="form-control mb-3"
            />
          </div>
        </div>
      )}
      <button onClick={() => setShowAddPatientForm((prev) => !prev)} className="btn btn-primary" style={{ width: '100%' }}>
        {showAddPatientForm ? 'Cancel' : 'Add symptoms'}
      </button>
      {showAddPatientForm && (
        <button onClick={handleAddPatient} className="btn btn-primary mt-3" style={{ width: '100%' }}>
          Add symptoms
        </button>
      )}
      </div>
      ):(<div></div>)
      }
      <div
        className="mb-4 p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          width: '80%',
          overflowX: 'auto',
        }}
      >
        <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ color: 'white', marginRight: '20px' }}>Patient Entries</h3>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: '200px' }}
          />
        </div>
        <table className="table" style={{ color: 'white', overflowY: 'auto', maxHeight: '500px' }}>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
              <th>Reg. Date</th>
              <th>Contact</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.firstname}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, firstname: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.firstname
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.lastname}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, lastname: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.lastname
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.age}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, age: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.age
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.regDate}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, regDate: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.regDate
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.contact}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, contact: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.contact
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <input
                      type="text"
                      value={patient.disease}
                      onChange={(e) => {
                        const updatedPatient = { ...patient, disease: e.target.value };
                        setPatients((prevPatients) =>
                          prevPatients.map((p) => (p._id === patient._id ? updatedPatient : p))
                        );
                      }}
                    />
                  ) : (
                    patient.disease
                  )}
                </td>
                <td>
                  {editablePatientId === patient._id ? (
                    <button className="btn btn-success" onClick={() => handleSave(patient._id)}>
                      Save
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleEdit(patient._id)}>
                      Edit
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(patient._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsPage;