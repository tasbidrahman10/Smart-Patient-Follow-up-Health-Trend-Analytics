const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Import database connection
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reminders', reminderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection
db.getConnection()
  .then(connection => {
    console.log('âœ… Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('âŒ Database connection failed:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`ðŸš€ Server running on http://localhost:${PORT}`);
  console.log(`âœ… Database connected successfully`);
});