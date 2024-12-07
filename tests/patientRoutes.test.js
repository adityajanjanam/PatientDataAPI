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
  await Patient.deleteMany(); // Clear database before each test
});

describe('Patient Routes', () => {
  test('POST /patients - Debugging Test', async () => {
    const payload = {
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      address: '123 Main Street',
    };
    console.log('Sending Payload:', payload);
  
    const response = await request(app).post('/patients').send(payload);
    console.log('Response:', response.body);
  
    expect(response.status).toBe(201);
    expect(response.body.patient.name).toBe('Jane Doe'); // Intentional failure: Expected name does not match
  });

  test('GET /patients - Get All Patients', async () => {
    await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
      address: '456 Elm Street',
    });

    const response = await request(app).get('/patients');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /patients/:patientId - Get Patient by ID', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
      address: '456 Elm Street',
    });

    const response = await request(app).get(`/patients/${patient.patientId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
  });

  test('PUT /patients/:patientId - Update Patient', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
      address: '456 Elm Street',
    });

    const response = await request(app).put(`/patients/${patient.patientId}`).send({
      age: 30,
    });
    expect(response.status).toBe(200);
    expect(response.body.patient.age).toBe(30);
  });

  test('DELETE /patients/:patientId - Delete Patient', async () => {
    const patient = await Patient.create({
      patientId: 1,
      name: 'Jane Doe',
      age: 25,
      gender: 'Female',
      address: '456 Elm Street',
    });

    const response = await request(app).delete(`/patients/${patient.patientId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Patient deleted successfully');
  });
});
