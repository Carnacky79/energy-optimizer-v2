const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const registerValidation = [
	body('name').trim().notEmpty().withMessage('Nome richiesto'),
	body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('La password deve essere di almeno 8 caratteri'),
];

const loginValidation = [
	body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
	body('password').notEmpty().withMessage('Password richiesta'),
];

const changePasswordValidation = [
	body('currentPassword').notEmpty().withMessage('Password attuale richiesta'),
	body('newPassword')
		.isLength({ min: 8 })
		.withMessage('La nuova password deve essere di almeno 8 caratteri'),
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put(
	'/change-password',
	authMiddleware,
	changePasswordValidation,
	authController.changePassword
);

module.exports = router;
