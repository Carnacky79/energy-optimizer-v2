const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get all reports for authenticated user
router.get('/', authMiddleware, async (req, res) => {
	try {
		const reports = await Report.find({ user: req.userId })
			.sort({ createdAt: -1 })
			.limit(50);

		res.json({ reports });
	} catch (error) {
		console.error('Get reports error:', error);
		res.status(500).json({ message: 'Errore nel recupero dei report' });
	}
});

// Create new report
router.post('/', authMiddleware, async (req, res) => {
	try {
		const reportData = {
			...req.body,
			user: req.userId,
		};

		const report = new Report(reportData);

		// Calculate efficiency if not provided
		if (!report.results.efficiencyLevel) {
			report.results.efficiencyLevel = report.calculateEfficiency();
		}

		await report.save();

		// Update user stats
		const user = await User.findById(req.userId);
		await user.updateStats(report);

		res.status(201).json({
			message: 'Report salvato con successo',
			report,
		});
	} catch (error) {
		console.error('Create report error:', error);
		res.status(500).json({ message: 'Errore nel salvataggio del report' });
	}
});

// Get single report
router.get('/:id', authMiddleware, async (req, res) => {
	try {
		const report = await Report.findOne({
			_id: req.params.id,
			user: req.userId,
		});

		if (!report) {
			return res.status(404).json({ message: 'Report non trovato' });
		}

		res.json({ report });
	} catch (error) {
		console.error('Get report error:', error);
		res.status(500).json({ message: 'Errore nel recupero del report' });
	}
});

// Update report
router.put('/:id', authMiddleware, async (req, res) => {
	try {
		const report = await Report.findOneAndUpdate(
			{ _id: req.params.id, user: req.userId },
			req.body,
			{ new: true, runValidators: true }
		);

		if (!report) {
			return res.status(404).json({ message: 'Report non trovato' });
		}

		res.json({
			message: 'Report aggiornato con successo',
			report,
		});
	} catch (error) {
		console.error('Update report error:', error);
		res.status(500).json({ message: "Errore nell'aggiornamento del report" });
	}
});

// Delete report
router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		const report = await Report.findOneAndDelete({
			_id: req.params.id,
			user: req.userId,
		});

		if (!report) {
			return res.status(404).json({ message: 'Report non trovato' });
		}

		res.json({ message: 'Report eliminato con successo' });
	} catch (error) {
		console.error('Delete report error:', error);
		res.status(500).json({ message: "Errore nell'eliminazione del report" });
	}
});

module.exports = router;
