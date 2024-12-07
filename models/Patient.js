const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: Number, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  clinicalData: [
    {
      type: { type: String, required: true },
      value: { type: String, required: true },
      date: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model('Patient', patientSchema);
