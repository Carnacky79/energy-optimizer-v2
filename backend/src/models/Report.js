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
				model: 'users',
				key: 'id',
			},
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		// CAMBIA QUESTI CAMPI IN JSON
		data: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: {},
		},
		results: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: {},
		},
		recommendations: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
		// Solo questi campi numerici per query rapide
		annualSavings: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			defaultValue: 0,
		},
		monthlySavings: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			defaultValue: 0,
		},
		co2Savings: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
			defaultValue: 0,
		},
		isPublic: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		pdfUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'reports',
		timestamps: true,
	}
);

module.exports = Report;
