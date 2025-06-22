// backend/src/models/AnalyticsEvent.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnalyticsEvent = sequelize.define(
	'AnalyticsEvent',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		eventType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		metadata: {
			type: DataTypes.JSON,
			defaultValue: {},
		},
	},
	{
		tableName: 'analytics_events',
	}
);

module.exports = AnalyticsEvent;
