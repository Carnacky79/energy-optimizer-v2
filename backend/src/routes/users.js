const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('stats');

		if (!user) {
			return res.status(404).json({ message: 'Utente non trovato' });
		}

		res.json({ stats: user.stats });
	} catch (error) {
		console.error('Get stats error:', error);
		res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
	}
});

// Get subscription info
router.get('/subscription', authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('subscription');

		if (!user) {
			return res.status(404).json({ message: 'Utente non trovato' });
		}

		res.json({ subscription: user.subscription });
	} catch (error) {
		console.error('Get subscription error:', error);
		res.status(500).json({ message: "Errore nel recupero dell'abbonamento" });
	}
});

module.exports = router;
