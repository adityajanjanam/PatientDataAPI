const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Patient = require('../models/Patient');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
      age: 30,
      gender: 'Female',
      address: '456 Elm Street',
    });
    expect(res.status).toBe(201); // Expect successful creation
    expect(res.body.patient.name).toBe('Jane Doe'); // Verify name
  });
});
