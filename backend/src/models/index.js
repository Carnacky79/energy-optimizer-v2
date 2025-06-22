// backend/src/models/index.js

const User = require('./User');
const Report = require('./Report');

// Definisci le associazioni
User.hasMany(Report, {
	foreignKey: 'userId',
	as: 'reports',
	onDelete: 'CASCADE',
});

Report.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

module.exports = {
	User,
	Report,
};
