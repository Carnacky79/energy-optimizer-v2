// backend/src/controllers/reportsController.js

const { Report, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize;

// Create new report
exports.createReport = async (req, res) => {
	try {
		const userId = req.userId;
		const reportData = req.body;

		console.log('Saving report data:', reportData); // Debug

		// Estrai i valori principali per il salvataggio rapido
		const annualSavings = parseFloat(
			reportData.annualSavings ||
				reportData.results?.savingsPotential?.annualSavings ||
				0
		);

		const monthlySavings = parseFloat(
			reportData.monthlySavings ||
				reportData.results?.savingsPotential?.monthlySavings ||
				0
		);

		// Calcola CO2 se non presente
		const consumption = parseFloat(reportData.data?.consumption || 0);
		const co2Savings = parseFloat(
			reportData.co2Savings ||
				reportData.results?.environmental?.co2Savings ||
				(consumption * 0.3 * 0.5) / 1000 // 30% risparmio * 0.5kg CO2/kWh / 1000 per tonnellate
		);

		// Crea il report
		const report = await Report.create({
			userId,
			title:
				reportData.title ||
				`Report del ${new Date().toLocaleDateString('it-IT')}`,
			data: reportData.data || {},
			results: reportData.results || {},
			recommendations: reportData.recommendations || [],
			annualSavings: isNaN(annualSavings) ? 0 : annualSavings,
			monthlySavings: isNaN(monthlySavings) ? 0 : monthlySavings,
			co2Savings: isNaN(co2Savings) ? 0 : co2Savings,
		});

		// Aggiorna le statistiche dell'utente
		const user = await User.findByPk(userId);
		if (user) {
			await user.update({
				totalReports: user.totalReports + 1,
				totalSavings: parseFloat(user.totalSavings || 0) + annualSavings,
				co2Saved: parseFloat(user.co2Saved || 0) + co2Savings,
			});
		}

		res.status(201).json({
			message: 'Report salvato con successo',
			report: report,
		});
	} catch (error) {
		console.error('Create report error:', error);
		res.status(500).json({
			message: 'Errore nel salvataggio del report',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Get all reports for user
exports.getAllReports = async (req, res) => {
	try {
		const userId = req.userId;
		const {
			page = 1,
			limit = 10,
			sortBy = 'createdAt',
			order = 'DESC',
		} = req.query;

		const offset = (page - 1) * limit;

		const { count, rows: reports } = await Report.findAndCountAll({
			where: { userId },
			order: [[sortBy, order]],
			limit: parseInt(limit),
			offset: parseInt(offset),
		});

		// Formatta i report per il frontend
		const formattedReports = reports.map((report) => {
			const reportData = report.toJSON();
			return {
				...reportData,
				// Estrai i dati principali per facile accesso
				consumption: reportData.data?.consumption,
				area: reportData.data?.area,
				bill: reportData.data?.bill,
				efficiencyLevel: reportData.results?.efficiencyLevel,
				// I campi numerici sono già al livello principale
				annualSavings: reportData.annualSavings,
				monthlySavings: reportData.monthlySavings,
				co2Savings: reportData.co2Savings,
			};
		});

		res.json({
			reports: formattedReports,
			pagination: {
				total: count,
				page: parseInt(page),
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error('Get all reports error:', error);
		res.status(500).json({
			message: 'Errore nel recupero dei report',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Get single report
exports.getReport = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const report = await Report.findOne({
			where: {
				id,
				userId, // Assicurati che l'utente possa vedere solo i suoi report
			},
		});

		if (!report) {
			return res.status(404).json({
				message: 'Report non trovato',
			});
		}

		res.json({ report });
	} catch (error) {
		console.error('Get report error:', error);
		res.status(500).json({
			message: 'Errore nel recupero del report',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Update report
exports.updateReport = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;
		const updates = req.body;

		const report = await Report.findOne({
			where: { id, userId },
		});

		if (!report) {
			return res.status(404).json({
				message: 'Report non trovato',
			});
		}

		// Aggiorna solo i campi permessi
		const allowedUpdates = [
			'title',
			'data',
			'results',
			'recommendations',
			'isPublic',
		];
		const filteredUpdates = {};

		allowedUpdates.forEach((field) => {
			if (updates[field] !== undefined) {
				filteredUpdates[field] = updates[field];
			}
		});

		// Ricalcola i valori se necessario
		if (updates.results) {
			filteredUpdates.annualSavings = parseFloat(
				updates.results?.savingsPotential?.annualSavings ||
					report.annualSavings ||
					0
			);
			filteredUpdates.monthlySavings = parseFloat(
				updates.results?.savingsPotential?.monthlySavings ||
					report.monthlySavings ||
					0
			);
			filteredUpdates.co2Savings = parseFloat(
				updates.results?.environmental?.co2Savings || report.co2Savings || 0
			);
		}

		await report.update(filteredUpdates);

		res.json({
			message: 'Report aggiornato con successo',
			report,
		});
	} catch (error) {
		console.error('Update report error:', error);
		res.status(500).json({
			message: "Errore nell'aggiornamento del report",
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Delete report
exports.deleteReport = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const report = await Report.findOne({
			where: { id, userId },
		});

		if (!report) {
			return res.status(404).json({
				message: 'Report non trovato',
			});
		}

		// Aggiorna le statistiche dell'utente prima di eliminare
		const user = await User.findByPk(userId);
		if (user) {
			await user.update({
				totalReports: Math.max(0, user.totalReports - 1),
				totalSavings: Math.max(
					0,
					parseFloat(user.totalSavings || 0) -
						parseFloat(report.annualSavings || 0)
				),
				co2Saved: Math.max(
					0,
					parseFloat(user.co2Saved || 0) - parseFloat(report.co2Savings || 0)
				),
			});
		}

		await report.destroy();

		res.json({
			message: 'Report eliminato con successo',
		});
	} catch (error) {
		console.error('Delete report error:', error);
		res.status(500).json({
			message: "Errore nell'eliminazione del report",
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Get report statistics
exports.getReportStats = async (req, res) => {
	try {
		const userId = req.userId;

		const stats = await Report.findOne({
			where: { userId },
			attributes: [
				[sequelize.fn('COUNT', sequelize.col('id')), 'totalReports'],
				[
					sequelize.fn('SUM', sequelize.col('annualSavings')),
					'totalAnnualSavings',
				],
				[
					sequelize.fn('SUM', sequelize.col('monthlySavings')),
					'totalMonthlySavings',
				],
				[sequelize.fn('SUM', sequelize.col('co2Savings')), 'totalCo2Savings'],
				[
					sequelize.fn('AVG', sequelize.col('annualSavings')),
					'avgAnnualSavings',
				],
			],
			raw: true,
		});

		// Ultimi 6 mesi di report per il grafico
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const monthlyReports = await Report.findAll({
			where: {
				userId,
				createdAt: { [Op.gte]: sixMonthsAgo },
			},
			attributes: [
				[
					sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'),
					'month',
				],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
				[sequelize.fn('SUM', sequelize.col('annualSavings')), 'totalSavings'],
			],
			group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
			order: [
				[
					sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'),
					'ASC',
				],
			],
			raw: true,
		});

		res.json({
			stats: {
				totalReports: parseInt(stats?.totalReports || 0),
				totalAnnualSavings: parseFloat(stats?.totalAnnualSavings || 0),
				totalMonthlySavings: parseFloat(stats?.totalMonthlySavings || 0),
				totalCo2Savings: parseFloat(stats?.totalCo2Savings || 0),
				avgAnnualSavings: parseFloat(stats?.avgAnnualSavings || 0),
			},
			monthlyTrend: monthlyReports,
		});
	} catch (error) {
		console.error('Get report stats error:', error);
		res.status(500).json({
			message: 'Errore nel recupero delle statistiche',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Share report (public link)
exports.shareReport = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const report = await Report.findOne({
			where: { id, userId },
		});

		if (!report) {
			return res.status(404).json({
				message: 'Report non trovato',
			});
		}

		// Genera un ID pubblico univoco se non esiste
		if (!report.publicId) {
			const publicId = `${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)}`;
			await report.update({
				isPublic: true,
				publicId,
			});
		} else {
			await report.update({ isPublic: true });
		}

		res.json({
			message: 'Report condiviso con successo',
			shareUrl: `${process.env.FRONTEND_URL}/public/report/${
				report.publicId || report.id
			}`,
		});
	} catch (error) {
		console.error('Share report error:', error);
		res.status(500).json({
			message: 'Errore nella condivisione del report',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

// Get public report (no auth required)
exports.getPublicReport = async (req, res) => {
	try {
		const { publicId } = req.params;

		const report = await Report.findOne({
			where: {
				[Op.or]: [{ publicId }, { id: publicId, isPublic: true }],
			},
			include: [
				{
					model: User,
					attributes: ['name'], // Solo il nome, non dati sensibili
				},
			],
		});

		if (!report) {
			return res.status(404).json({
				message: 'Report non trovato o non pubblico',
			});
		}

		res.json({
			report: {
				...report.toJSON(),
				user: { name: report.User?.name || 'Utente Energy Optimizer' },
			},
		});
	} catch (error) {
		console.error('Get public report error:', error);
		res.status(500).json({
			message: 'Errore nel recupero del report pubblico',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

module.exports = exports;
