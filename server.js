const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const Patient = require('./models/Patient'); 

dotenv.config();

// Constants
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/patient_data';
const PORT = process.env.PORT || 3000;

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB Connection
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
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
        url: `http://localhost:${PORT}`, 
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

// Critical Condition Endpoint
app.get('/patients/critical', async (req, res) => {
  try {
    const criticalPatients = await Patient.find({
      $or: [
        { 'clinicalData.type': 'Blood Pressure', 'clinicalData.value': { $regex: /^(?:[1-4]?[0-9]|150)\/(?:[5-8]?[0-9]|100)$/ } },
        { 'clinicalData.type': 'Blood Oxygen Level', 'clinicalData.value': { $lt: 92 } },
        { 'clinicalData.type': 'Heartbeat Rate', 'clinicalData.value': { $lt: 40, $gt: 120 } },
      ],
    });

    res.status(200).json({ criticalPatients });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching critical patients', details: error.message });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
