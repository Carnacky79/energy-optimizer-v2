// // backend/src/routes/analytics.js

// const express = require('express');
// const router = express.Router();
// const { User } = require('../models');

// // Track eventi di conversione
// router.post('/track', async (req, res) => {
// 	try {
// 		const { event, data } = req.body;

// 		// Log dell'evento (in produzione useresti Google Analytics o Mixpanel)
// 		console.log('Conversion Event:', {
// 			event,
// 			data,
// 			timestamp: new Date(),
// 			ip: req.ip,
// 			userAgent: req.headers['user-agent'],
// 		});

// 		// Eventi specifici
// 		switch (event) {
// 			case 'exit_intent_shown':
// 				// Traccia quante volte viene mostrato
// 				break;

// 			case 'wheel_spin':
// 				// Traccia chi gira la ruota
// 				break;

// 			case 'premium_conversion':
// 				// Traccia conversioni a pagamento
// 				if (req.userId) {
// 					await User.update(
// 						{ lastConversion: new Date() },
// 						{ where: { id: req.userId } }
// 					);
// 				}
// 				break;
// 		}

// 		res.json({ success: true });
// 	} catch (error) {
// 		console.error('Analytics error:', error);
// 		res.status(500).json({ error: 'Failed to track event' });
// 	}
// });

// // Get conversion stats (solo admin)
// router.get('/stats', async (req, res) => {
// 	try {
// 		const stats = {
// 			totalUsers: await User.count(),
// 			premiumUsers: await User.count({
// 				where: { subscriptionPlan: 'premium' },
// 			}),
// 			conversionRate: 0, // Calcola in base ai dati
// 			avgRevenuePerUser: 0, // Calcola in base ai dati
// 		};

// 		res.json(stats);
// 	} catch (error) {
// 		res.status(500).json({ error: 'Failed to get stats' });
// 	}
// });

// module.exports = router;

// backend/src/routes/analytics.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
	trackShare,
	trackClick,
	trackConversion,
	getUserAnalytics,
	getGlobalAnalytics,
} = require('../controllers/analyticsController');

// User routes
router.post('/share', auth, trackShare);
router.post('/click/:shareId', trackClick);
router.post('/conversion', trackConversion);
router.get('/user', auth, getUserAnalytics);

// Admin routes
router.get('/global', auth, getGlobalAnalytics);

module.exports = router;
