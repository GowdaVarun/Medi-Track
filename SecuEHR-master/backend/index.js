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
// console.log(process.env.MONGODB_URI);

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
  const { firstname, lastname, age, regDate, contact, disease,email,password } = req.body;
  try {
    const hashedPassword = await crypto.createHash('sha256').update(password).digest('hex');
    const encryptedPatient = {
      firstname: encrypt(firstname),
      lastname: encrypt(lastname),
      age: encrypt(age.toString()), 
      regDate: encrypt(regDate),
      contact: encrypt(contact),
      disease: encrypt(disease),
      role: 'Patient',
      password: hashedPassword,
      email: email

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
      firstname: decrypt(patient.firstname),
      lastname: decrypt(patient.lastname),
      age: decrypt(patient.age),
      email: patient.email,
      regDate: decrypt(patient.regDate),
      contact: decrypt(patient.contact),
      disease: decrypt(patient.disease),
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
      firstname: decrypt(patient.firstname),
      lastname: decrypt(patient.lastname),
      age: decrypt(patient.age),
      regDate: decrypt(patient.regDate),
      email: patient.email,
      contact: decrypt(patient.contact),
      disease: decrypt(patient.disease),
    }));
    res.json(decryptedPatients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, age, regDate, contact, disease,email,password } = req.body;
  
  try {
    
    // Retrieve the existing patient information
    const existingPatient = await PatientModel.findById(id);

    // Decrypt the existing patient information
    let decryptedPatient = {
      firstname: decrypt(existingPatient.firstname),
      lastname: decrypt(existingPatient.lastname),
      age: decrypt(existingPatient.age),
      regDate: decrypt(existingPatient.regDate),
      contact: decrypt(existingPatient.contact),
      disease: decrypt(existingPatient.disease),
    };

    // Update the patient information
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      {
        firstname: encrypt(firstname || decryptedPatient.firstname), // Use the existing value if not provided in the update
        lastname: encrypt(lastname || decryptedPatient.lastname),
        age: encrypt(age || decryptedPatient.age),
        regDate: encrypt(regDate || decryptedPatient.regDate),
        contact: encrypt(contact || decryptedPatient.contact),
        disease: encrypt(disease),
      },
      { new: true }
    );
    decryptedPatient = {
      firstname: decrypt(updatedPatient.firstname),
      lastname: decrypt(updatedPatient.lastname),
      age: decrypt(updatedPatient.age),
      regDate: decrypt(updatedPatient.regDate),
      contact: decrypt(updatedPatient.contact),
      disease: decrypt(updatedPatient.disease),
    };
    res.json(decryptedPatient);
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
      patientName:encrypt(patientName),
      patientemail: patientemail,
      appointmentDate: encrypt(appointmentDate),
      appointmentTime: encrypt(appointmentTime),
      age: encrypt(age.toString()), // Convert age to string before encryption
      gender: encrypt(gender),
      contactNumber: encrypt(contactNumber),
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
      patientName: decrypt(appointment.patientName),
      patientemail: (appointment.patientemail),
      appointmentDate: decrypt(appointment.appointmentDate),
      appointmentTime: decrypt(appointment.appointmentTime),
      age: decrypt(appointment.age),
      gender: decrypt(appointment.gender),
      contactNumber: decrypt(appointment.contactNumber),
      status: appointment.status
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
      patientName: decrypt(existingAppointment.patientName),
      patientemail: (patientemail),
      appointmentDate: decrypt(existingAppointment.appointmentDate),
      appointmentTime: decrypt(existingAppointment.appointmentTime),
      age: decrypt(existingAppointment.age),
      gender: decrypt(existingAppointment.gender),
      contactNumber: decrypt(existingAppointment.contactNumber),
      status: status
    };

    // Update the appointment information
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      {
        status,
        patientName: encrypt(patientName || decryptedAppointment.patientName), // Use the existing value if not provided in the update
        patientemail,
        appointmentDate: encrypt(appointmentDate || decryptedAppointment.appointmentDate),
        appointmentTime: encrypt(appointmentTime || decryptedAppointment.appointmentTime),
        age: encrypt(age.toString() || decryptedAppointment.age),
        gender: encrypt(gender || decryptedAppointment.gender),
        contactNumber: encrypt(contactNumber || decryptedAppointment.contactNumber),
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
        name : encrypt(name),
        email : email,
        password: hashedPassword,
        role : encrypt(role),
        specialization : encrypt(specialization),
        location : encrypt(location),
        contact : encrypt(contact)
      });
    } else if (role === 'Patient') {
      const { firstname, lastname, age, regDate, contact } = req.body;
      newUser = new PatientModel({
        name : encrypt(name),
        email : email,
        password: hashedPassword,
        role : encrypt(role),
        firstname : encrypt(firstname),
        lastname : encrypt(lastname),
        age : encrypt(age),
        regDate : encrypt(regDate),
        contact : encrypt(contact),
        disease: '',
      });
    } else {
      newUser = new FormDataModel({
        name: encrypt(name),
        email: email,
        password: hashedPassword,
        role: encrypt(role)
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
      name: decrypt(doctor.name),
      role: 'Doctor',
      email: doctor.email
    }));
    const users = await FormDataModel.find();
    const decryptedUsers = users.map(user => ({
      name: decrypt(user.name),
      email: user.email,
      role: 'Admin'
    }));
    const patients = await PatientModel.find();
    const decryptedPatients = patients.map(patient=>({
      name: decrypt(patient.firstname),
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
  const {name, specialization, location, contact ,email,password} = req.body;
  const hashedPassword = await crypto.createHash('sha256').update(password).digest('hex');
  try {
    const encryptedDoctor = {
      name: encrypt(name),
      email: email,
      password: hashedPassword,
      specialization: encrypt(specialization),
      location: encrypt(location),
      contact: encrypt(contact),
      role: encrypt('Doctor')
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
      _id: doctor._id,
      name: decrypt(doctor.name),
      specialization: decrypt(doctor.specialization),
      location: decrypt(doctor.location),
      contact: decrypt(doctor.contact),
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
          name: encrypt(name),
          specialization: encrypt(specialization),
          location: encrypt(location),
          contact: encrypt(contact),
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
    patientName,
    diagnosis,
    treatmentPlan,
    medications,
    dateOfVisit,
    attendingDoctor,
    labResults,
    followUpDate,
  } = req.body;
  console.log("patientName",patientName);
  
  try {
    // const encryptedcontact = encrypt(contact);
    // const patient = await PatientModel.find({'contact': encryptedcontact});
    // if(patient.length!=0){
    const encryptedRecord = {
      patientName: encrypt(patientName),
      diagnosis: encrypt(diagnosis),
      treatmentPlan: encrypt(treatmentPlan),
      medications: encrypt(medications),
      dateOfVisit: encrypt(dateOfVisit),
      attendingDoctor: encrypt(attendingDoctor),
      labResults: encrypt(labResults),
      followUpDate: encrypt(followUpDate),
    };

    const medicalRecord = new MedicalRecordModel(encryptedRecord);
    const newRecord = await medicalRecord.save();
    res.status(201).json(newRecord);
  // }
    // else{
    //   console.log("Patient not found");
    //   res.status(404).json({});
    // }
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
      patientName: decrypt(record.patientName),
      diagnosis: decrypt(record.diagnosis),
      treatmentPlan: decrypt(record.treatmentPlan),
      medications: decrypt(record.medications),
      dateOfVisit: decrypt(record.dateOfVisit),
      attendingDoctor: decrypt(record.attendingDoctor),
      labResults: decrypt(record.labResults),
      followUpDate: decrypt(record.followUpDate),
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
      patientId: decrypt(existingRecord.patientId),
      diagnosis: decrypt(existingRecord.diagnosis),
      treatmentPlan: decrypt(existingRecord.treatmentPlan),
      medications: decrypt(existingRecord.medications),
      dateOfVisit: decrypt(existingRecord.dateOfVisit),
      attendingDoctor: decrypt(existingRecord.attendingDoctor),
      labResults: decrypt(existingRecord.labResults),
      followUpDate: decrypt(existingRecord.followUpDate),
    };
    const patient = await PatientModel.find({'contact': contact});
    if(patient){
    const updatedRecord = await MedicalRecordModel.findByIdAndUpdate(
      id,
      {
        patientId: encrypt(patientId || decryptedRecord.patientId),
        diagnosis: encrypt(diagnosis || decryptedRecord.diagnosis),
        treatmentPlan: encrypt(treatmentPlan || decryptedRecord.treatmentPlan),
        medications: encrypt(medications || decryptedRecord.medications),
        dateOfVisit: encrypt(dateOfVisit || decryptedRecord.dateOfVisit),
        attendingDoctor: encrypt(attendingDoctor || decryptedRecord.attendingDoctor),
        labResults: encrypt(labResults || decryptedRecord.labResults),
        followUpDate: encrypt(followUpDate || decryptedRecord.followUpDate),
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
