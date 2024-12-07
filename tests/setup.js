const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: false, useUnifiedTopology: false });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
