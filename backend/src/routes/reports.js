// const express = require('express');
// const router = express.Router();
// const { Report, User } = require('../models');
// const authMiddleware = require('../middleware/auth');

// // Get all reports for authenticated user
// router.get('/', authMiddleware, async (req, res) => {
// 	try {
// 		const reports = await Report.findAll({
// 			where: { userId: req.userId },
// 			order: [['createdAt', 'DESC']],
// 			limit: 50,
// 		});

// 		res.json({ reports });
// 	} catch (error) {
// 		console.error('Get reports error:', error);
// 		res.status(500).json({ message: 'Errore nel recupero dei report' });
// 	}
// });

// // Create new report
// router.post('/', authMiddleware, async (req, res) => {
// 	try {
// 		const reportData = {
// 			...req.body,
// 			userId: req.userId,
// 		};

// 		// Calculate efficiency
// 		const tempReport = Report.build(reportData);
// 		const efficiency = tempReport.calculateEfficiency();

// 		reportData.efficiencyLevel = efficiency.level;
// 		reportData.efficiencyScore = efficiency.score;
// 		reportData.efficiencyColor = efficiency.color;
// 		reportData.efficiencyFactor = efficiency.factor;

// 		const report = await Report.create(reportData);

// 		// Update user stats
// 		const user = await User.findByPk(req.userId);
// 		await user.updateStats(report);

// 		res.status(201).json({
// 			message: 'Report salvato con successo',
// 			report,
// 		});
// 	} catch (error) {
// 		console.error('Create report error:', error);
// 		res.status(500).json({ message: 'Errore nel salvataggio del report' });
// 	}
// });

// // Get single report
// router.get('/:id', authMiddleware, async (req, res) => {
// 	try {
// 		const report = await Report.findOne({
// 			where: {
// 				id: req.params.id,
// 				userId: req.userId,
// 			},
// 		});

// 		if (!report) {
// 			return res.status(404).json({ message: 'Report non trovato' });
// 		}

// 		res.json({ report });
// 	} catch (error) {
// 		console.error('Get report error:', error);
// 		res.status(500).json({ message: 'Errore nel recupero del report' });
// 	}
// });

// // Update report
// router.put('/:id', authMiddleware, async (req, res) => {
// 	try {
// 		const report = await Report.findOne({
// 			where: {
// 				id: req.params.id,
// 				userId: req.userId,
// 			},
// 		});

// 		if (!report) {
// 			return res.status(404).json({ message: 'Report non trovato' });
// 		}

// 		await report.update(req.body);

// 		res.json({
// 			message: 'Report aggiornato con successo',
// 			report,
// 		});
// 	} catch (error) {
// 		console.error('Update report error:', error);
// 		res.status(500).json({ message: "Errore nell'aggiornamento del report" });
// 	}
// });

// // Delete report
// router.delete('/:id', authMiddleware, async (req, res) => {
// 	try {
// 		const result = await Report.destroy({
// 			where: {
// 				id: req.params.id,
// 				userId: req.userId,
// 			},
// 		});

// 		if (!result) {
// 			return res.status(404).json({ message: 'Report non trovato' });
// 		}

// 		res.json({ message: 'Report eliminato con successo' });
// 	} catch (error) {
// 		console.error('Delete report error:', error);
// 		res.status(500).json({ message: "Errore nell'eliminazione del report" });
// 	}
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

router.get('/', authMiddleware, reportsController.getAllReports);
router.get('/:id', authMiddleware, reportsController.getReport);
router.post('/', authMiddleware, reportsController.createReport);
router.put('/:id', authMiddleware, reportsController.updateReport);
router.delete('/:id', authMiddleware, reportsController.deleteReport);

module.exports = router;
