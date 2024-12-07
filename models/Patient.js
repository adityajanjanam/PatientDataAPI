const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Patient', PatientSchema);
