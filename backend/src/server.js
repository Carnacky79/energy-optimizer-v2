const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');

const { sequelize, testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
		database: 'MySQL',
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

// Initialize database and start server
const startServer = async () => {
	try {
		// Test database connection
		await testConnection();

		// Sync database models
		await sequelize.sync({
			//alter: process.env.NODE_ENV === 'development', // Only alter tables in development
		});
		console.log('✅ Database synchronized');

		// Start server
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error);
		process.exit(1);
	}
};

startServer();

module.exports = app;
