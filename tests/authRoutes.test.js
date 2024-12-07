const request = require('supertest');
const app = require('../app');

describe('Authentication API Endpoints', () => {
  test('POST /auth/signup - Register New User', async () => {
    const response = await request(app).post('/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('POST /auth/login - User Login', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in successfully');
  });

  test('POST /auth/forgot-password - Forgot Password', async () => {
    const response = await request(app).post('/auth/forgot-password').send({
      email: 'test@example.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset link sent');
  });
});
2