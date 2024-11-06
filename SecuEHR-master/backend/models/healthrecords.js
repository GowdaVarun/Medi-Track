const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: String,
  diagnosis: String,
  treatmentPlan: String,
  medications: String,
  dateOfVisit: String,
  attendingDoctor: String,
  labResults: String,
  followUpDate: String,
});

const MedicalRecordModel = mongoose.model('medicalrecords', medicalRecordSchema);

module.exports = MedicalRecordModel;
