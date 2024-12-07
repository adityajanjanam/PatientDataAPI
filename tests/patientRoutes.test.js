const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const Patient = require('../models/Patient'); 
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Patient.deleteMany(); 
});

describe('Patient Routes', () => {
  test('POST /patients - Add New Patient', async () => {
    const response = await request(app).post('/patients').send({
      name: 'John Doe',
      dob: '1990-01-01',
      contact: '1234567890',
      medicalHistory: 'None',
    });
    expect(response.status).toBe(201);
    expect(response.body.patient.name).toBe('John Doe');
  });

  test('GET /patients - Get All Patients', async () => {
    await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      dob: '1990-01-01',
      contact: '1234567890',
      medicalHistory: 'Asthma',
    });

    const response = await request(app).get('/patients');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /patients/:patientId - Get Patient by ID', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      dob: '1990-01-01',
      contact: '1234567890',
      medicalHistory: 'Asthma',
    });

    const response = await request(app).get(`/patients/${patient.patientId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
  });

  test('PUT /patients/:patientId - Update Patient', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      dob: '1990-01-01',
      contact: '1234567890',
      medicalHistory: 'Asthma',
    });

    const response = await request(app).put(`/patients/${patient.patientId}`).send({
      contact: '9876543210',
    });
    expect(response.status).toBe(200);
    expect(response.body.patient.contact).toBe('9876543210');
  });

  test('DELETE /patients/:patientId - Delete Patient', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      dob: '1990-01-01',
      contact: '1234567890',
      medicalHistory: 'Asthma',
    });

    const response = await request(app).delete(`/patients/${patient.patientId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Patient deleted successfully');
  });
});
