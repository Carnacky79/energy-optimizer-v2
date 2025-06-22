// backend/src/controllers/adminController.js

const { User, Report, ShareTracking, AnalyticsEvent } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Ottieni tutti gli utenti con filtri
const getAllUsers = async (req, res) => {
	try {
		const { search, subscriptionType, page = 1, limit = 20 } = req.query;
		const offset = (page - 1) * limit;

		// Costruisci condizioni di ricerca
		const where = {};

		if (search) {
			where[Op.or] = [
				{ name: { [Op.like]: `%${search}%` } },
				{ email: { [Op.like]: `%${search}%` } },
			];
		}

		if (subscriptionType && subscriptionType !== 'all') {
			if (subscriptionType === 'expired') {
				where.subscriptionExpiry = { [Op.lt]: new Date() };
			} else {
				where.subscriptionType = subscriptionType;
			}
		}

		// Query con conteggio report
		const { count, rows: users } = await User.findAndCountAll({
			where,
			attributes: [
				'id',
				'name',
				'email',
				'role',
				'subscriptionType',
				'subscriptionPlan',
				'subscriptionExpiry',
				'lastLogin',
				'totalShares',
				'totalReports',
				'totalSavings',
				'co2Saved',
				'createdAt',
				'isActive',
				'emailVerified',
			],
			order: [['createdAt', 'DESC']],
			limit: parseInt(limit),
			offset,
		});

		res.json({
			users,
			pagination: {
				total: count,
				page: parseInt(page),
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error('Get all users error:', error);
		res.status(500).json({ error: 'Errore nel recupero degli utenti' });
	}
};

// Ottieni dettagli singolo utente
const getUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id, {
			attributes: { exclude: ['password'] },
			include: [
				{
					model: Report,
					as: 'reports',
					order: [['createdAt', 'DESC']],
					limit: 10,
				},
			],
		});

		if (!user) {
			return res.status(404).json({ error: 'Utente non trovato' });
		}

		// Statistiche utente
		const shareStats = await ShareTracking.findAll({
			where: { userId: id },
			attributes: [
				[sequelize.fn('COUNT', sequelize.col('id')), 'totalShares'],
				[sequelize.fn('SUM', sequelize.col('clickCount')), 'totalClicks'],
				[sequelize.fn('SUM', sequelize.col('conversions')), 'totalConversions'],
			],
			raw: true,
		});

		res.json({
			user,
			stats: shareStats[0],
		});
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({ error: "Errore nel recupero dell'utente" });
	}
};

// Aggiorna utente
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		// Campi che possono essere aggiornati dall'admin
		const allowedUpdates = [
			'name',
			'email',
			'role',
			'subscriptionType',
			'subscriptionPlan',
			'subscriptionExpiry',
			'bonusMonths',
		];

		const filteredUpdates = {};
		allowedUpdates.forEach((field) => {
			if (updates[field] !== undefined) {
				filteredUpdates[field] = updates[field];
			}
		});

		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ error: 'Utente non trovato' });
		}

		await user.update(filteredUpdates);

		res.json({
			message: 'Utente aggiornato con successo',
			user: await user.reload(),
		});
	} catch (error) {
		console.error('Update user error:', error);
		res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
	}
};

// Elimina utente
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ error: 'Utente non trovato' });
		}

		// Non permettere l'eliminazione di superadmin
		if (user.role === 'superadmin') {
			return res
				.status(403)
				.json({ error: 'Non puoi eliminare un superadmin' });
		}

		await user.destroy();

		res.json({ message: 'Utente eliminato con successo' });
	} catch (error) {
		console.error('Delete user error:', error);
		res.status(500).json({ error: "Errore nell'eliminazione dell'utente" });
	}
};

// Statistiche globali per dashboard
const getGlobalStats = async (req, res) => {
	try {
		const { days = 30 } = req.query;
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - parseInt(days));

		// KPI Principali
		const totalUsers = await User.count();
		const premiumUsers = await User.count({
			where: { subscriptionType: 'premium' },
		});
		const totalReports = await Report.count();
		const totalShares = await ShareTracking.count();

		// Nuovi utenti questo mese
		const newUsersThisMonth = await User.count({
			where: {
				createdAt: {
					[Op.gte]: new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						1
					),
				},
			},
		});

		// Calcolo revenue
		const monthlyRevenue = await User.findAll({
			where: { subscriptionType: 'premium' },
			attributes: [
				[
					sequelize.fn(
						'SUM',
						sequelize.literal(
							'CASE WHEN subscriptionPlan = "monthly" THEN 9.90 ELSE 79/12 END'
						)
					),
					'revenue',
				],
			],
			raw: true,
		});

		// Distribuzione abbonamenti
		const usersBySubscription = await User.findAll({
			attributes: [
				'subscriptionType',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: ['subscriptionType'],
			raw: true,
		});

		// Top referrer con conversioni
		const topReferrers = await sequelize.query(
			`
      SELECT 
        u.id, u.name, u.email, u.totalShares,
        SUM(st.conversions) as conversions,
        SUM(st.conversions) * 9.90 as revenueGenerated
      FROM users u
      LEFT JOIN share_trackings st ON u.id = st.userId
      GROUP BY u.id
      HAVING conversions > 0
      ORDER BY conversions DESC
      LIMIT 10
    `,
			{ type: sequelize.QueryTypes.SELECT }
		);

		// Trend giornalieri
		const dailyMetrics = await sequelize.query(
			`
      SELECT 
        DATE(createdAt) as date,
        COUNT(CASE WHEN role = 'user' THEN id END) as newUsers,
        COUNT(CASE WHEN subscriptionType = 'premium' THEN id END) as newPremium,
        SUM(CASE 
          WHEN subscriptionType = 'premium' AND subscriptionPlan = 'monthly' THEN 9.90/30
          WHEN subscriptionType = 'premium' AND subscriptionPlan = 'yearly' THEN 79/365
          ELSE 0 
        END) as revenue
      FROM users
      WHERE createdAt >= ?
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `,
			{
				replacements: [startDate],
				type: sequelize.QueryTypes.SELECT,
			}
		);

		res.json({
			kpi: {
				totalUsers,
				premiumUsers,
				conversionRate: ((premiumUsers / totalUsers) * 100).toFixed(2),
				totalReports,
				totalShares,
				monthlyRevenue: monthlyRevenue[0]?.revenue || 0,
				newUsersThisMonth,
			},
			usersBySubscription,
			topReferrers,
			dailyMetrics,
		});
	} catch (error) {
		console.error('Get global stats error:', error);
		res
			.status(500)
			.json({ error: 'Errore nel recupero delle statistiche globali' });
	}
};

module.exports = {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	getGlobalStats,
};
