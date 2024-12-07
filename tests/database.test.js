const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // Increase timeout for Jest
  jest.setTimeout(30000);

  // Start MongoMemoryServer
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory MongoDB
  await mongoose.connect(uri, { useNewUrlParser: false, useUnifiedTopology: false });
});

afterAll(async () => {
  // Disconnect and stop the MongoMemoryServer
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('MongoDB Connection Test', async () => {
  // Check if the connection is ready
  expect(mongoose.connection.readyState).toBe(1); // 1 = connected
});
