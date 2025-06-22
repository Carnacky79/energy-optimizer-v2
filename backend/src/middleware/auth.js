const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	try {
		// Get token from header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Token non fornito' });
		}

		// Extract token
		const token = authHeader.substring(7);

		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || 'your-secret-key'
		);

		// Add user ID to request
		req.userId = decoded.userId;
		req.user = decoded.user;

		next();
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Token non valido' });
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token scaduto' });
		}

		console.error('Auth middleware error:', error);
		res.status(500).json({ message: 'Errore di autenticazione' });
	}
};

module.exports = authMiddleware;
