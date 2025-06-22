// backend/src/middleware/adminAuth.js

module.exports = (req, res, next) => {
	if (!req.user || req.user.role !== 'superadmin') {
		return res.status(403).json({
			error: 'Accesso negato. Solo superadmin.',
		});
	}
	next();
};
