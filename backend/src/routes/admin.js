// backend/src/routes/admin.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	getGlobalStats,
} = require('../controllers/adminController');

// Tutte le route admin richiedono autenticazione + ruolo superadmin
router.use(auth);
router.use(adminAuth);

router.get('/analytics', getGlobalStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
