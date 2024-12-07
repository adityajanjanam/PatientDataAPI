const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - gender
 *         - address
 *       properties:
 *         patientId:
 *           type: integer
 *           description: The auto-generated ID of the patient
 *         name:
 *           type: string
 *           description: The name of the patient
 *         age:
 *           type: integer
 *           description: The age of the patient
 *         gender:
 *           type: string
 *           description: The gender of the patient
 *         address:
 *           type: string
 *           description: The address of the patient
 *       example:
 *         patientId: 1
 *         name: John Doe
 *         age: 45
 *         gender: Male
 *         address: 123 Main Street
 */

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management API
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Error creating patient
 */
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

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Error fetching patients
 */
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, age, gender, address } = req.body;
    if (!name || !age || !gender || !address) {
      return res.status(400).json({ error: 'All fields (name, age, gender, address) are required.' });
    }

    // Generate patient ID
    const patientCount = await Patient.countDocuments();
    const patientId = patientCount + 1;

    const newPatient = new Patient({ patientId, ...req.body });
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error('Error adding patient:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Error adding patient', details: error.message });
  }
});



router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error in GET /patients:', error.message);
    res.status(500).json({ error: 'Error fetching patients', details: error.message });
  }
});



/**
 * @swagger
 * /patients/{patientId}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Error fetching patient
 */
router.get('/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient', details: error.message });
  }
});

/**
 * @swagger
 * /patients/{patientId}:
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Error updating patient
 */
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

/**
 * @swagger
 * /patients/{patientId}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Error deleting patient
 */
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
