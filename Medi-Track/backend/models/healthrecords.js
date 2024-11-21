const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientName: {
    type: String,
  required: true
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatmentPlan: {
    type: String,
    required: true,
  },
  medications: {
    type: String,
    required: true,
  },
  dateOfVisit: {
    type: String,
    required: true,
  },
  attendingDoctor: {
    type: String,
    required: true,
  },
  labResults: {
    type: String,
    required: true,
  },
  followUpDate: {
    type: String,
    required: true,
  }
});

const MedicalRecordModel = mongoose.model('medicalrecords', medicalRecordSchema);

module.exports = MedicalRecordModel;
