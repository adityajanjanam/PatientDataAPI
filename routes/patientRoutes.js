const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

/**
 * Add all Swagger documentation for routes.
 * Refer to the original provided code for Swagger annotations.
 */

// Create a patient
router.post('/', async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    const patientId = patientCount + 1;

    const newPatient = new Patient({ patientId, ...req.body });
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    res.status(500).json({ error: 'Error adding patient', details: error.message });
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients', details: error.message });
  }
});

// Get patient by ID
router.get('/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient', details: error.message });
  }
});

// Update a patient
router.put('/:patientId', async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true }
    );
    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient', details: error.message });
  }
});

// Delete a patient
router.delete('/:patientId', async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({ patientId: req.params.patientId });
    if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient', details: error.message });
  }
});

module.exports = router;
