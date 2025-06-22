const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Nome richiesto'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Email richiesta'],
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, 'Email non valida'],
	},
	password: {
		type: String,
		required: [true, 'Password richiesta'],
		minlength: [8, 'La password deve essere di almeno 8 caratteri'],
	},
	role: {
		type: String,
		enum: ['user', 'premium', 'admin', 'consultant'],
		default: 'user',
	},
	subscription: {
		type: {
			plan: {
				type: String,
				enum: ['free', 'basic', 'premium', 'business'],
				default: 'free',
			},
			startDate: Date,
			endDate: Date,
			autoRenew: {
				type: Boolean,
				default: false,
			},
		},
		default: {
			plan: 'free',
		},
	},
	profile: {
		company: String,
		phone: String,
		address: {
			street: String,
			city: String,
			province: String,
			postalCode: String,
			country: {
				type: String,
				default: 'IT',
			},
		},
	},
	preferences: {
		notifications: {
			email: {
				type: Boolean,
				default: true,
			},
			reports: {
				type: Boolean,
				default: true,
			},
			tips: {
				type: Boolean,
				default: true,
			},
		},
		language: {
			type: String,
			default: 'it',
		},
	},
	stats: {
		totalReports: {
			type: Number,
			default: 0,
		},
		totalSavings: {
			type: Number,
			default: 0,
		},
		co2Saved: {
			type: Number,
			default: 0,
		},
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	emailVerificationToken: String,
	passwordResetToken: String,
	passwordResetExpires: Date,
	lastLogin: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
	// Only hash if password is modified
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Update timestamps
userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	delete user.emailVerificationToken;
	delete user.passwordResetToken;
	delete user.passwordResetExpires;
	return user;
};

// Update user stats
userSchema.methods.updateStats = async function (report) {
	this.stats.totalReports += 1;
	this.stats.totalSavings += report.results.savingsPotential.annualSavings || 0;
	this.stats.co2Saved += report.results.co2Savings || 0;
	await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
