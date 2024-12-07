const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
require('dotenv').config();

// Load environment variables
dotenv.config();

// Constants
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['https://patientdataapi-fjgqg3g5cvbse3av.canadacentral-01.azurewebsites.net'],
  })
);

// MongoDB Connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Data API',
      version: '1.0.0',
      description: 'API documentation for the Patient Data API',
    },
    servers: [
      {
        url: 'https://patientdataapi-fjgqg3g5cvbse3av.canadacentral-01.azurewebsites.net', // Azure Deployment URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Adjust path if necessary
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
