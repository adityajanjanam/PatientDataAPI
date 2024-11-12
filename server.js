// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/patientdata')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Data API',
      version: '1.0.0',
      description: 'API for managing patient data',
      contact: {
        name: 'Aditya Janjanam',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Patient model
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

const Patient = mongoose.model('Patient', PatientSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - name
 *         - dob
 *         - contact
 *         - medicalHistory
 *       properties:
 *         patientId:
 *           type: number
 *           description: The unique ID for the patient
 *         name:
 *           type: string
 *           description: The patient's name
 *         dob:
 *           type: string
 *           format: date
 *           description: The patient's date of birth
 *         contact:
 *           type: string
 *           description: The patient's contact information
 *         medicalHistory:
 *           type: string
 *           description: The patient's medical history
 */

// Signup API
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new healthcare provider
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
app.post('/signup', (req, res) => {
  // Implementation for signup
  res.status(201).json({ message: 'User registered successfully' });
});

// Login API
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login for healthcare providers
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
app.post('/login', (req, res) => {
  // Implementation for login
  res.status(200).json({ message: 'User logged in successfully' });
});

// Forgot Password API
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Forgot password for healthcare providers
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid email
 */
app.post('/forgot-password', (req, res) => {
  // Implementation for forgot password
  res.status(200).json({ message: 'Password reset link sent' });
});

// Add Patient Record API
/**
 * @swagger
 * /patients/{patientId}/records:
 *   post:
 *     summary: Add a new patient record
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: number
 *         required: true
 *         description: The patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloodPressure:
 *                 type: string
 *               respirationRate:
 *                 type: string
 *               oxygenSaturation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient record added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Patient not found
 */
app.post('/patients/:patientId/records', (req, res) => {
  // Implementation for adding patient record
  res.status(201).json({ message: 'Patient record added successfully' });
});

// View Patient Records API
/**
 * @swagger
 * /patients/{patientId}/records:
 *   get:
 *     summary: View patient records
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: number
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: List of patient records
 *       400:
 *         description: Invalid patient ID
 *       404:
 *         description: Patient not found
 */
app.get('/patients/:patientId/records', (req, res) => {
  // Implementation for viewing patient records
  res.status(200).json({ message: 'List of patient records' });
});

// Critical Condition Alert API
/**
 * @swagger
 * /patients/critical:
 *   get:
 *     summary: Get list of patients in critical condition
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of patients in critical condition
 *       500:
 *         description: Internal server error
 */
app.get('/patients/critical', (req, res) => {
  // Implementation for getting critical patients
  res.status(200).json({ message: 'List of patients in critical condition' });
});

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Add a new patient
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/patients', async (req, res) => {
  try {
    const { name, dob, contact, medicalHistory } = req.body;

    const patientCount = await Patient.countDocuments();
    const patientId = patientCount + 1;

    const newPatient = new Patient({ patientId, name, dob, contact, medicalHistory });
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (err) {
    console.error('Error adding patient:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Bad request', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patient]
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
 *         description: Internal server error
 */
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /patients/{patientId}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: number
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: Patient data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Invalid patient ID format
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
app.get('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }

    const patient = await Patient.findOne({ patientId: parseInt(patientId) });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /patients/{patientId}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: number
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
app.put('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    if (isNaN(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: parseInt(patientId) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (err) {
    console.error('Error updating patient:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Bad request', details: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Base route
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome to the PatientData API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to the PatientData API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
