const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const PatientModel = require('./models/Patient');
const FormDataModel = require('./models/FormData');
const DoctorModel = require('./models/Doctor');
const AppointmentModel = require('./models/Appointments.js');
const MedicalRecordModel = require('./models/healthrecords.js');
const axios = require("axios")
const { encrypt, decrypt } = require('./encryption'); // Import the encryption functions
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

const frontend_url ='http://localhost:5173';
// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontend_url);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Adjust timeout as needed
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

const loginAttempts = new Map();

app.get('/api/medical-documents', async (req, res) => {
  try {
    // Fetch medical documents from the database
    const documents = await MedicalDocumentModel.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const file = req.files.file;

    // Your logic to handle the uploaded file (save it to the server, update the database, etc.)
    // Example: Save the file to a folder on the server
    const uploadPath = __dirname + '/uploads/' + file.name;
    file.mv(uploadPath, function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      // File uploaded successfully, update the database or send a response
      res.json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
  skipFailedRequests: true,
});

app.post('/patients', async (req, res) => {
  const { firstname, lastname, age, regDate, contact, disease } = req.body;
  try {
    const encryptedPatient = {
      firstname: firstname,
      lastname: lastname,
      age: age.toString(), 
      regDate: regDate,
      contact: contact,
      disease: disease,
    };

    const patient = new PatientModel(encryptedPatient);
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
    console.log("SUccessfiljeifnheoaibf");
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

app.get('/patients', async (req, res) => {
  try {
    const patients = await PatientModel.find();//find only ones sith disease
    // Decrypt patient information before sending it to the client
    const decryptedPatients = patients.map(patient => ({
      _id: patient._id,
      firstname: patient.firstname,
      lastname: patient.lastname,
      age: patient.age,
      regDate: patient.regDate,
      contact: patient.contact,
      disease: patient.disease,
    }));
    res.json(decryptedPatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/myentries', async (req, res) => {
  try {
    const { patientemail } = req.query; // Get patientemail from query params
    
    // Find patients with matching first or last name (or both if you prefer)
    const patients = await PatientModel.find({
      $and: [
        { "email": patientemail },
        { "disease": {$ne:''} } // Checks that 'disease' is not an empty string
      ]
    });   

    // Decrypt patient information
    const decryptedPatients = patients.map(patient => ({
      _id: patient._id,
      firstname: patient.firstname,
      lastname: patient.lastname,
      age: patient.age,
      regDate: patient.regDate,
      contact: patient.contact,
      disease: patient.disease,
    }));
    
    res.json(decryptedPatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, age, regDate, contact, disease } = req.body;
  try {
    // Retrieve the existing patient information
    const existingPatient = await PatientModel.findById(id);

    // Decrypt the existing patient information
    const decryptedPatient = {
      firstname: existingPatient.firstname,
      lastname: existingPatient.lastname,
      age: existingPatient.age,
      regDate: existingPatient.regDate,
      contact: existingPatient.contact,
      disease: existingPatient.disease,
    };

    // Update the patient information
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      {
        firstname: firstname || decryptedPatient.firstname, // Use the existing value if not provided in the update
        lastname: lastname || decryptedPatient.lastname,
        age: age.toString() || decryptedPatient.age,
        regDate: regDate || decryptedPatient.regDate,
        contact: contact || decryptedPatient.contact,
        disease: disease || decryptedPatient.disease,
      },
      { new: true }
    );

    res.json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await PatientModel.findByIdAndDelete(id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/appointments', async (req, res) => {
  const { patientName, patientemail,appointmentDate, appointmentTime, age, gender, contactNumber } = req.body;
  try {
    const encryptedAppointment = {
      patientName:patientName,
      patientemail: patientemail,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      age: age.toString(), // Convert age to string before encryption
      gender: gender,
      contactNumber: contactNumber,
    };

    const appointment = new AppointmentModel(encryptedAppointment);
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await AppointmentModel.find();
    // Decrypt appointment information before sending it to the client
    const decryptedAppointments = appointments.map(appointment => ({
      _id: appointment._id,
      patientName: appointment.patientName,
      patientemail: appointment.patientemail,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      age: appointment.age,
      gender: appointment.gender,
      contactNumber: appointment.contactNumber,
    }));
    res.json(decryptedAppointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status, patientName, appointmentDate, appointmentTime, age, gender, contactNumber,patientemail } = req.body;
  try {
    // Retrieve the existing appointment information
    const existingAppointment = await AppointmentModel.findById(id);

    // Decrypt the existing appointment information
    const decryptedAppointment = {
      patientName: existingAppointment.patientName,
      patientemail: patientemail,
      appointmentDate: existingAppointment.appointmentDate,
      appointmentTime: existingAppointment.appointmentTime,
      age: existingAppointment.age,
      gender: existingAppointment.gender,
      contactNumber: existingAppointment.contactNumber,
      status: status
    };

    // Update the appointment information
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      {
        status,
        patientName: (patientName || decryptedAppointment.patientName), // Use the existing value if not provided in the update
        patientemail,
        appointmentDate: (appointmentDate || decryptedAppointment.appointmentDate),
        appointmentTime: (appointmentTime || decryptedAppointment.appointmentTime),
        age: (age.toString() || decryptedAppointment.age),
        gender: (gender || decryptedAppointment.gender),
        contactNumber: (contactNumber || decryptedAppointment.contactNumber),
      },
      { new: true }
    );

    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await AppointmentModel.findByIdAndDelete(id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.options('/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/login', loginLimiter, async (req, res) => {
  const { email, password, role } = req.body;

  // Choose the correct model based on the role
  let Model;
  if (role === 'Doctor') {
    Model = DoctorModel;
  } else if (role === 'Patient') {
    Model = PatientModel;
  } else if (role === 'Admin') {
    Model = FormDataModel;
  } else {
    return res.status(400).json('Invalid role');
  }
  try {
    const user = await Model.findOne({ email });

    if (user) {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      // console.log("Hashed Password:", hashedPassword);
      // console.log("User entered password from db:", user.password);
      if (hashedPassword === user.password) {
        res.json('Success');
      } else {
        res.status(401).json('Incorrect password');
      }
    } else {
      res.status(401).json('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('An error occurred');
  }
});

app.options('/register', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

app.post('/register', loginLimiter, async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists in the relevant collection based on role
  let Model;
  if (role === 'Doctor') {
    Model = DoctorModel;
  } else if (role === 'Patient') {
    Model = PatientModel;
  } else {
    Model = FormDataModel;
  }

  try {
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(401).send("Exists");
    }

    const hashedPassword = await crypto.createHash('sha256').update(password).digest('hex');

    let newUser;
    if (role === 'Doctor') {
      const { specialization, location, contact } = req.body;
      newUser = new DoctorModel({
        name : (name),
        email : email,
        password: hashedPassword,
        role : (role),
        specialization : (specialization),
        location : (location),
        contact : (contact)
      });
    } else if (role === 'Patient') {
      const { firstname, lastname, age, regDate, contact } = req.body;
      newUser = new PatientModel({
        name : (name),
        email : email,
        password: hashedPassword,
        role : (role),
        firstname : (firstname),
        lastname : (lastname),
        age : (age),
        regDate : (regDate),
        contact : (contact),
        disease: '',
      });
    } else {
      newUser = new FormDataModel({
        name: (name),
        email: email,
        password: hashedPassword,
        role: (role)
      });
    }

    await newUser.save();
    res.status(201).send("success");
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send("Error");
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    const decryptedDoctors = doctors.map(doctor => ({
      name: (doctor.name),
      role: 'Doctor',
      email: doctor.email
    }));
    const users = await FormDataModel.find();
    const decryptedUsers = users.map(user => ({
      name: (user.name),
      email: user.email,
      role: 'Admin'
    }));
    const patients = await PatientModel.find();
    const decryptedPatients = patients.map(patient=>({
      name: (patient.name),
      email: patient.email,
      role: 'Patient',
    }));
    const decryptedData = [
      ...decryptedDoctors,
      ...decryptedUsers,
      ...decryptedPatients
    ];
    res.json(decryptedData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/doctors', async (req, res) => {
  const {name, specialization, location, contact } = req.body;
  try {
    const encryptedDoctor = {
      name: (name),
      specialization: (specialization),
      location: (location),
      contact: (contact),
    };

    const doctor = new DoctorModel(encryptedDoctor);
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    // Decrypt doctor information before sending it to the client
    const decryptedDoctors = doctors.map(doctor => ({
      name: (doctor.name),
      specialization: (doctor.specialization),
      location: (doctor.location),
      contact: (doctor.contact),
    }));
    res.json(decryptedDoctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a doctor
app.put('/doctors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, specialization, location, contact } = req.body;
  try {
    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { _id: id }, // Use _id as the identifier
      {
        $set: {
          name: (name),
          specialization: (specialization),
          location: (location),
          contact: (contact),
        }
      },
      { new: true }
    );

    res.json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a doctor
app.delete('/doctors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await DoctorModel.findByIdAndDelete(id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/medical-records', async (req, res) => {
  const {
    contact,
    diagnosis,
    treatmentPlan,
    medications,
    dateOfVisit,
    attendingDoctor,
    labResults,
    followUpDate,
  } = req.body;
  
  try {
    const patient = await PatientModel.find({'contact': contact});
    if(patient.length!=0){
    const encryptedRecord = {
      patientName: (patient.firstname + " " + patient.lastname),
      diagnosis: (diagnosis),
      treatmentPlan: (treatmentPlan),
      medications: (medications),
      dateOfVisit: (dateOfVisit),
      attendingDoctor: (attendingDoctor),
      labResults: (labResults),
      followUpDate: (followUpDate),
    };

    const medicalRecord = new MedicalRecordModel(encryptedRecord);
    const newRecord = await medicalRecord.save();
    res.status(201).json(newRecord);}
    else{
      console.log("Patient not found");
      res.status(404).json({});
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecordModel.find();
    if(records){
    const decryptedRecords = records.map((record) => ({
      _id: record._id,
      patientName: (record.patientName),
      diagnosis: (record.diagnosis),
      treatmentPlan: (record.treatmentPlan),
      medications: (record.medications),
      dateOfVisit: (record.dateOfVisit),
      attendingDoctor: (record.attendingDoctor),
      labResults: (record.labResults),
      followUpDate: (record.followUpDate),
    }));
    res.json(decryptedRecords);}
    else{
      throw new Error("No record found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/medical-records/:id', async (req, res) => {
  const { id } = req.params;
  const {
    contact,
    diagnosis,
    treatmentPlan,
    medications,
    dateOfVisit,
    attendingDoctor,
    labResults,
    followUpDate,
  } = req.body;
  try {
    
    const existingRecord = await MedicalRecordModel.findById(id);
    const decryptedRecord = {
      patientName: (existingRecord.patientName),
      diagnosis: (existingRecord.diagnosis),
      treatmentPlan: (existingRecord.treatmentPlan),
      medications: (existingRecord.medications),
      dateOfVisit: (existingRecord.dateOfVisit),
      attendingDoctor: (existingRecord.attendingDoctor),
      labResults: (existingRecord.labResults),
      followUpDate: (existingRecord.followUpDate),
    };
    const patient = await PatientModel.find({'contact': contact});
    if(patient){
    const updatedRecord = await MedicalRecordModel.findByIdAndUpdate(
      id,
      {
        patientId: (patientId || decryptedRecord.patientId),
        diagnosis: (diagnosis || decryptedRecord.diagnosis),
        treatmentPlan: (treatmentPlan || decryptedRecord.treatmentPlan),
        medications: (medications || decryptedRecord.medications),
        dateOfVisit: (dateOfVisit || decryptedRecord.dateOfVisit),
        attendingDoctor: (attendingDoctor || decryptedRecord.attendingDoctor),
        labResults: (labResults || decryptedRecord.labResults),
        followUpDate: (followUpDate || decryptedRecord.followUpDate),
      },
      { new: true }
    );
    res.json(updatedRecord);
  }else{
    throw new Error("Patient Not found");
  }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/medical-records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await MedicalRecordModel.findByIdAndDelete(id);
    res.json({ message: 'Medical record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
