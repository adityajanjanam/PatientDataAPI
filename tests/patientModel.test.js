const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Patient = require('../models/Patient');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Patient.deleteMany(); // Clear database after each test
});

describe('Patient Routes', () => {
  it('should add a new patient', async () => {
    const res = await request(app).post('/patients').send({
      name: 'Jane Doe',
      dob: '1990-02-01',
      contact: '9876543210',
      medicalHistory: 'None',
    });
    expect(res.status).toBe(201);
    expect(res.body.patient.name).toBe('Jane Doe');
  });
});
