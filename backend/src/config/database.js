const { Sequelize } = require('sequelize');

// Configurazione database
const sequelize = new Sequelize(
	process.env.DB_NAME || 'energy_optimizer',
	process.env.DB_USER || 'root',
	process.env.DB_PASSWORD || '',
	{
		host: process.env.DB_HOST || 'localhost',
		dialect: 'mysql',
		logging: process.env.NODE_ENV === 'development' ? console.log : false,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

// Test connessione
const testConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log('✅ MySQL connected successfully');
	} catch (error) {
		console.error('❌ Unable to connect to MySQL:', error);
	}
};

module.exports = { sequelize, testConnection };
