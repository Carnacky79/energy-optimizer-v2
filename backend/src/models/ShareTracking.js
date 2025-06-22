// backend/src/models/ShareTracking.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShareTracking = sequelize.define(
	'ShareTracking',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		shareId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		reportId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Reports',
				key: 'id',
			},
		},
		platform: {
			type: DataTypes.ENUM(
				'whatsapp',
				'facebook',
				'linkedin',
				'twitter',
				'link'
			),
			allowNull: false,
		},
		clickCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		conversions: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		tableName: 'share_trackings',
	}
);

module.exports = ShareTracking;
