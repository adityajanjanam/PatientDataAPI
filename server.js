// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample Data
let patients = [
  {
    id: 1,
    name: 'Harsha',
    age: 32,
    gender: 'Male',
    tests: [
      {
        date: '2024-11-01',
        type: 'Blood Pressure',
        reading: '120/80 mmHg'
      }
    ]
  }
];

// Endpoint 1: Add Patient Info
app.post('/patients', (req, res) => {
  const { name, age, gender } = req.body;
  const newPatient = {
    id: patients.length + 1,
    name,
    age,
    gender,
    tests: []
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Endpoint 2: View Patient Info
app.get('/patients/:id', (req, res) => {
  const patientId = parseInt(req.params.id);
  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    res.status(200).json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// Endpoint 3: Add Tests for a Patient
app.post('/patients/:id/tests', (req, res) => {
  const patientId = parseInt(req.params.id);
  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    const { date, type, reading } = req.body;
    const newTest = { date, type, reading };
    patient.tests.push(newTest);
    res.status(201).json(newTest);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// Endpoint 4: List All Patients Info
app.get('/patients', (req, res) => {
  res.status(200).json(patients);
});

// Endpoint 5: Update Patient Info
app.put('/patients/:id', (req, res) => {
  const patientId = parseInt(req.params.id);
  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    const { name, age, gender } = req.body;
    if (name) patient.name = name;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    res.status(200).json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// Endpoint 6: Delete Patient Info
app.delete('/patients/:id', (req, res) => {
  const patientId = parseInt(req.params.id);
  const patientIndex = patients.findIndex(p => p.id === patientId);
  if (patientIndex !== -1) {
    patients.splice(patientIndex, 1);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// Endpoint 7: Delete All Patients
app.delete('/patients', (req, res) => {
  patients = [];
  res.status(200).json({ message: 'All patients deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
