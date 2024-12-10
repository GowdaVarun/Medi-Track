const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  regDate: {
    type: String,
    required: true,
  },
  disease:{
    type: String,
    default: "",
  },
  contact: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required:true
  },
  currentMedications: { type: String, default: "None"},
  height: {
    type: String,
    required: true,
  },
  weight:{
    type: String,
    required:true,
  },
  uniqueID: {
    type: String,
  } 
  
});

const PatientModel = mongoose.model('patients', patientSchema);

module.exports = PatientModel;
