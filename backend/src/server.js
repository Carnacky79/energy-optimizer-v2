// backend/src/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');

// Create Express app
const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
	.connect(
		process.env.MONGODB_URI || 'mongodb://localhost:27017/energy-optimizer',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log('✅ MongoDB connected successfully'))
	.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		message: err.message || 'Internal server error',
		error: process.env.NODE_ENV === 'development' ? err : {},
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
