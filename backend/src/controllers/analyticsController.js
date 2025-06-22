// backend/src/controllers/analyticsController.js

const { User, Report, ShareTracking, AnalyticsEvent } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Traccia eventi di condivisione
const trackShare = async (req, res) => {
	try {
		const userId = req.user.id;
		const { reportId, platform, shareId } = req.body;

		const share = await ShareTracking.create({
			userId,
			reportId,
			platform,
			shareId,
			clickCount: 0,
		});

		// Incrementa il contatore condivisioni dell'utente
		await User.increment('totalShares', { where: { id: userId } });

		res.json({
			success: true,
			shareId: share.shareId,
			shareUrl: `${process.env.FRONTEND_URL}/shared/${share.shareId}`,
		});
	} catch (error) {
		console.error('Track share error:', error);
		res.status(500).json({ error: 'Errore nel tracking della condivisione' });
	}
};

// Traccia click su link condiviso
const trackClick = async (req, res) => {
	try {
		const { shareId } = req.params;
		const { referrer } = req.body;

		const share = await ShareTracking.findOne({ where: { shareId } });
		if (share) {
			await share.increment('clickCount');

			// Registra l'evento
			await AnalyticsEvent.create({
				eventType: 'share_click',
				userId: share.userId,
				metadata: { shareId, referrer, platform: share.platform },
			});
		}

		res.json({ success: true });
	} catch (error) {
		console.error('Track click error:', error);
		res.status(500).json({ error: 'Errore nel tracking del click' });
	}
};

// Traccia conversione da condivisione
const trackConversion = async (req, res) => {
	try {
		const { shareId, convertedUserId } = req.body;

		const share = await ShareTracking.findOne({ where: { shareId } });
		if (share) {
			await share.increment('conversions');

			// Registra l'evento
			await AnalyticsEvent.create({
				eventType: 'share_conversion',
				userId: share.userId,
				metadata: { shareId, convertedUserId, platform: share.platform },
			});

			// Bonus per il referrer (es. 1 mese gratis ogni 3 conversioni)
			const userShares = await ShareTracking.findAll({
				where: { userId: share.userId },
				attributes: [
					[
						sequelize.fn('SUM', sequelize.col('conversions')),
						'totalConversions',
					],
				],
			});

			const totalConversions = userShares[0]?.dataValues?.totalConversions || 0;
			if (totalConversions % 3 === 0) {
				await User.update(
					{ bonusMonths: sequelize.literal('bonusMonths + 1') },
					{ where: { id: share.userId } }
				);
			}
		}

		res.json({ success: true });
	} catch (error) {
		console.error('Track conversion error:', error);
		res.status(500).json({ error: 'Errore nel tracking della conversione' });
	}
};

// Dashboard analytics per utente
const getUserAnalytics = async (req, res) => {
	try {
		const userId = req.user.id;
		const { startDate, endDate } = req.query;

		// Metriche generali
		const shares = await ShareTracking.findAll({
			where: {
				userId,
				createdAt: {
					[Op.between]: [
						startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
						endDate || new Date(),
					],
				},
			},
		});

		const totalShares = shares.length;
		const totalClicks = shares.reduce(
			(sum, share) => sum + share.clickCount,
			0
		);
		const totalConversions = shares.reduce(
			(sum, share) => sum + share.conversions,
			0
		);

		// Analytics per piattaforma
		const platformStats = await ShareTracking.findAll({
			where: { userId },
			attributes: [
				'platform',
				[sequelize.fn('COUNT', sequelize.col('id')), 'shares'],
				[sequelize.fn('SUM', sequelize.col('clickCount')), 'clicks'],
				[sequelize.fn('SUM', sequelize.col('conversions')), 'conversions'],
			],
			group: ['platform'],
		});

		// Trend temporale
		const dailyStats = await ShareTracking.findAll({
			where: { userId },
			attributes: [
				[sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
				[sequelize.fn('COUNT', sequelize.col('id')), 'shares'],
				[sequelize.fn('SUM', sequelize.col('clickCount')), 'clicks'],
			],
			group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
			order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
		});

		res.json({
			overview: {
				totalShares,
				totalClicks,
				totalConversions,
				conversionRate:
					totalClicks > 0
						? ((totalConversions / totalClicks) * 100).toFixed(2)
						: 0,
				viralCoefficient:
					totalShares > 0 ? (totalConversions / totalShares).toFixed(2) : 0,
			},
			platformStats,
			dailyStats,
			topShares: shares.sort((a, b) => b.clickCount - a.clickCount).slice(0, 5),
		});
	} catch (error) {
		console.error('Get analytics error:', error);
		res.status(500).json({ error: 'Errore nel recupero delle analytics' });
	}
};

// SUPER ADMIN: Analytics globali
const getGlobalAnalytics = async (req, res) => {
	try {
		// Verifica se è superadmin
		if (req.user.role !== 'superadmin') {
			return res.status(403).json({ error: 'Accesso negato' });
		}

		const { startDate, endDate } = req.query;
		const dateFilter = {
			createdAt: {
				[Op.between]: [
					startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
					endDate || new Date(),
				],
			},
		};

		// KPI Principali
		const totalUsers = await User.count();
		const premiumUsers = await User.count({
			where: { subscriptionType: 'premium' },
		});
		const totalReports = await Report.count();
		const totalShares = await ShareTracking.count();

		// Revenue metrics
		const revenue = await User.findAll({
			where: { subscriptionType: 'premium' },
			attributes: [
				[
					sequelize.fn(
						'SUM',
						sequelize.literal(
							'CASE WHEN subscriptionPlan = "monthly" THEN 9.90 ELSE 79 END'
						)
					),
					'totalRevenue',
				],
			],
		});

		// Utenti per tipo di abbonamento
		const usersBySubscription = await User.findAll({
			attributes: [
				'subscriptionType',
				'subscriptionPlan',
				[sequelize.fn('COUNT', sequelize.col('id')), 'count'],
			],
			group: ['subscriptionType', 'subscriptionPlan'],
		});

		// Top performers
		const topReferrers = await User.findAll({
			attributes: ['id', 'name', 'email', 'totalShares'],
			include: [
				{
					model: ShareTracking,
					as: 'shares',
					attributes: [],
				},
			],
			group: ['User.id'],
			order: [[sequelize.literal('totalShares'), 'DESC']],
			limit: 10,
		});

		// Trend giornalieri
		const dailyMetrics = await sequelize.query(
			`
      SELECT 
        DATE(createdAt) as date,
        COUNT(DISTINCT CASE WHEN role = 'user' THEN id END) as newUsers,
        COUNT(DISTINCT CASE WHEN subscriptionType = 'premium' THEN id END) as newPremium
      FROM Users
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `,
			{ type: sequelize.QueryTypes.SELECT }
		);

		res.json({
			kpi: {
				totalUsers,
				premiumUsers,
				conversionRate: ((premiumUsers / totalUsers) * 100).toFixed(2),
				totalReports,
				totalShares,
				monthlyRevenue: revenue[0]?.dataValues?.totalRevenue || 0,
			},
			usersBySubscription,
			topReferrers,
			dailyMetrics,
		});
	} catch (error) {
		console.error('Get global analytics error:', error);
		res
			.status(500)
			.json({ error: 'Errore nel recupero delle analytics globali' });
	}
};

module.exports = {
	trackShare,
	trackClick,
	trackConversion,
	getUserAnalytics,
	getGlobalAnalytics,
};
