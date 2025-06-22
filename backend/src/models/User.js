// backend/src/models/User.js

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: { msg: 'Nome richiesto' },
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: { msg: 'Email non valida' },
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					args: [8, 255],
					msg: 'La password deve essere di almeno 8 caratteri',
				},
			},
		},
		role: {
			type: DataTypes.ENUM('user', 'admin', 'superadmin'),
			defaultValue: 'user',
		},
		subscriptionType: {
			type: DataTypes.ENUM('free', 'premium'),
			defaultValue: 'free',
		},
		subscriptionPlan: {
			type: DataTypes.ENUM('monthly', 'yearly'),
			allowNull: true,
		},
		subscriptionExpiry: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		subscriptionAutoRenew: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		// Profile fields
		company: {
			type: DataTypes.STRING,
		},
		phone: {
			type: DataTypes.STRING,
		},
		street: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
		},
		province: {
			type: DataTypes.STRING,
		},
		postalCode: {
			type: DataTypes.STRING,
		},
		country: {
			type: DataTypes.STRING,
			defaultValue: 'IT',
		},
		// Preferences
		notificationEmail: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		notificationReports: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		notificationTips: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		language: {
			type: DataTypes.STRING,
			defaultValue: 'it',
		},
		// Stats
		totalReports: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		totalSavings: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0,
		},
		co2Saved: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0,
		},
		totalShares: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		bonusMonths: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		// Status
		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		emailVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		emailVerificationToken: {
			type: DataTypes.STRING,
		},
		passwordResetToken: {
			type: DataTypes.STRING,
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
		},
		lastLogin: {
			type: DataTypes.DATE,
		},
	},
	{
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed('password')) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			},
		},
		indexes: [
			{
				unique: true,
				fields: ['email'],
			},
		],
	}
);

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
	const values = { ...this.get() };
	delete values.password;
	delete values.emailVerificationToken;
	delete values.passwordResetToken;
	delete values.passwordResetExpires;
	return values;
};

User.prototype.updateStats = async function (report) {
	this.totalReports += 1;
	this.totalSavings =
		parseFloat(this.totalSavings) + parseFloat(report.annualSavings || 0);
	this.co2Saved =
		parseFloat(this.co2Saved) + parseFloat(report.co2Savings || 0);
	await this.save();
};

module.exports = User;
