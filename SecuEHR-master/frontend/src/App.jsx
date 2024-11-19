import Home from './components/Home/Home';
import Login from './components/Login/Login';
import PatientsPage from './components/Patients/Patients';
import Register from './components/Register/Register';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import DoctorsPage from './components/Doctors/Doctors';
import DoctorDashboard from './components/DoctorDashBoard/docDash';
import PatientDashboard from './components/PatientDashBoard/Patdash';
import HealthRecordPage from './components/HealthRecords/Healthrecords';
import AppointmentBooking from './components/Appointments/Appointments';
import MedicalDocuments from './components/MedicalDocuments/MedicalDocuments';
import Footer from "./components/Footer/Footer"

function App() {

  return (
    <div style={{marginTop : '-3.5rem'}}>
      <BrowserRouter >
        <Routes>
          <Route path="/" element ={<Login/>} />
          <Route path="/login" element ={<Login/>} />
          <Route path="/register" element ={<Register/>} />
          <Route path="/home" element ={<Home/>} />
          <Route path="/docdash" element ={<DoctorDashboard/>} />
          <Route path="/patdash" element ={<PatientDashboard/>} />
          <Route path="/healthrecords" element ={<HealthRecordPage/>} />
          <Route path="/appointments" element ={<AppointmentBooking/>} />
          <Route path="/Patients" element ={<PatientsPage/>} />
          <Route path="/Doctors" element ={<DoctorsPage/>} />
          <Route path="/medicaldocuments" element ={<MedicalDocuments/>} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  )
}

export default App
