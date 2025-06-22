const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
		expiresIn: '30d',
	});
};

// Register new user
exports.register = async (req, res) => {
	try {
		// Check validation errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				message: 'Un utente con questa email esiste già',
			});
		}

		// Create new user
		const user = new User({
			name,
			email,
			password,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			message: 'Registrazione completata con successo',
			token,
			user: user.toJSON(),
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({
			message: 'Errore durante la registrazione',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Login user
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: 'Email o password non validi',
			});
		}

		// Check if account is active
		if (!user.isActive) {
			return res.status(401).json({
				message: 'Account non attivo',
			});
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				message: 'Email o password non validi',
			});
		}

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		// Generate token
		const token = generateToken(user._id);

		res.json({
			message: 'Login effettuato con successo',
			token,
			user: user.toJSON(),
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			message: 'Errore durante il login',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Get current user
exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'Utente non trovato' });
		}

		res.json({ user: user.toJSON() });
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({
			message: 'Errore nel recupero dati utente',
		});
	}
};

// Update user profile
exports.updateProfile = async (req, res) => {
	try {
		const updates = req.body;
		const allowedUpdates = ['name', 'profile', 'preferences'];

		// Filter only allowed fields
		const filteredUpdates = {};
		Object.keys(updates).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				filteredUpdates[key] = updates[key];
			}
		});

		const user = await User.findByIdAndUpdate(req.userId, filteredUpdates, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return res.status(404).json({ message: 'Utente non trovato' });
		}

		res.json({
			message: 'Profilo aggiornato con successo',
			user: user.toJSON(),
		});
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({
			message: "Errore durante l'aggiornamento del profilo",
		});
	}
};

// Change password
exports.changePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'Utente non trovato' });
		}

		// Verify current password
		const isPasswordValid = await user.comparePassword(currentPassword);
		if (!isPasswordValid) {
			return res.status(401).json({
				message: 'Password attuale non corretta',
			});
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res.json({ message: 'Password aggiornata con successo' });
	} catch (error) {
		console.error('Change password error:', error);
		res.status(500).json({
			message: 'Errore durante il cambio password',
		});
	}
};
