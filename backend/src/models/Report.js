const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		default: function () {
			return `Report del ${new Date().toLocaleDateString('it-IT')}`;
		},
	},
	formData: {
		consumption: {
			type: Number,
			required: true,
		},
		bill: {
			type: Number,
			required: true,
		},
		area: {
			type: Number,
			required: true,
		},
		heatingType: {
			type: String,
			enum: ['gas', 'elettrico', 'pompa_calore', 'altro'],
			default: 'gas',
		},
		buildingType: {
			type: String,
			enum: ['residenziale', 'ufficio', 'commerciale', 'industriale'],
			default: 'residenziale',
		},
		occupants: Number,
		usageTime: String,
	},
	results: {
		efficiencyLevel: {
			level: String,
			score: Number,
			color: String,
			factor: Number,
		},
		savingsPotential: {
			monthlySavings: Number,
			annualSavings: Number,
			percentage: Number,
		},
		investment: Number,
		roi: Number,
		co2Savings: Number,
	},
	recommendations: [
		{
			title: String,
			description: String,
			savings: String,
			priority: {
				type: String,
				enum: ['alta', 'media', 'bassa'],
			},
			implemented: {
				type: Boolean,
				default: false,
			},
		},
	],
	notes: String,
	sharedWith: [
		{
			email: String,
			sharedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	pdfUrl: String,
	isPublic: {
		type: Boolean,
		default: false,
	},
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
reportSchema.index({ user: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

// Update timestamps
reportSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

// Calculate efficiency level
reportSchema.methods.calculateEfficiency = function () {
	const consumptionPerArea = this.formData.consumption / this.formData.area;

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

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
