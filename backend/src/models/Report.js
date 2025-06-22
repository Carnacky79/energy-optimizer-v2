// backend/src/models/Report.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Report = sequelize.define(
	'Report',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		title: {
			type: DataTypes.STRING,
			defaultValue: function () {
				return `Report del ${new Date().toLocaleDateString('it-IT')}`;
			},
		},
		// Form data
		consumption: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		bill: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		area: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		heatingType: {
			type: DataTypes.ENUM('gas', 'elettrico', 'pompa_calore', 'altro'),
			defaultValue: 'gas',
		},
		buildingType: {
			type: DataTypes.ENUM(
				'residenziale',
				'ufficio',
				'commerciale',
				'industriale'
			),
			defaultValue: 'residenziale',
		},
		occupants: {
			type: DataTypes.INTEGER,
		},
		usageTime: {
			type: DataTypes.STRING,
		},
		// Results
		efficiencyLevel: {
			type: DataTypes.STRING,
		},
		efficiencyScore: {
			type: DataTypes.INTEGER,
		},
		efficiencyColor: {
			type: DataTypes.STRING,
		},
		efficiencyFactor: {
			type: DataTypes.DECIMAL(3, 2),
		},
		monthlySavings: {
			type: DataTypes.DECIMAL(10, 2),
		},
		annualSavings: {
			type: DataTypes.DECIMAL(10, 2),
		},
		savingsPercentage: {
			type: DataTypes.INTEGER,
		},
		investment: {
			type: DataTypes.DECIMAL(10, 2),
		},
		roi: {
			type: DataTypes.DECIMAL(5, 2),
		},
		co2Savings: {
			type: DataTypes.DECIMAL(10, 2),
		},
		// Additional fields
		recommendations: {
			type: DataTypes.JSON,
			defaultValue: [],
		},
		notes: {
			type: DataTypes.TEXT,
		},
		pdfUrl: {
			type: DataTypes.STRING,
		},
		isPublic: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		indexes: [
			{
				fields: ['userId', 'createdAt'],
			},
		],
	}
);

// Instance methods
Report.prototype.calculateEfficiency = function () {
	const consumptionPerArea = this.consumption / this.area;

	if (consumptionPerArea < 5) {
		return { level: 'Ottimo', score: 90, color: '#059669', factor: 0.3 };
	} else if (consumptionPerArea < 10) {
		return { level: 'Buono', score: 75, color: '#2563eb', factor: 0.5 };
	} else if (consumptionPerArea < 15) {
		return { level: 'Medio', score: 60, color: '#eab308', factor: 0.7 };
	} else if (consumptionPerArea < 20) {
		return { level: 'Scarso', score: 40, color: '#f97316', factor: 0.9 };
	} else {
		return { level: 'Critico', score: 25, color: '#dc2626', factor: 1.0 };
	}
};

module.exports = Report;
